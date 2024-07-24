import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
  DragUpdate,
} from 'react-beautiful-dnd';
import update from 'immutability-helper';
import styles from './TaskBoard.less';
import IssueItem from './IssueItem';
import RenameColumn from './RenameColumnWindow';
import axios from 'axios';
import Loader from './Loader';

interface Issue {
  id: number;
  name: string;
  content: string;
  comments: string[];
  urls: string[];
}

interface initialDataInferface {
  id: number;
  name: string;
  issues: Issue[];
}

interface ColumnProps {
  columnIndex: number;
  activeColumn: initialDataInferface | null;
  column: initialDataInferface;
}

interface IssueProps {
  id: number;
  issueIndex: number;
  name: string;
}

interface IssueItemProps {
  columnId: number;
  issueId: number;
}

enum PageStatus {
  Loading,
  Home,
}

const TaskBoard = () => {
  const [status, setStatus] = useState<PageStatus>(PageStatus.Loading);
  useEffect(() => {
    setTimeout(() => {
      setStatus(PageStatus.Home);
    }, 3000);
  }, []);
  if (status === PageStatus.Loading) {
    return <Loader />;
  } else {
    return <BoardHome />;
  }
};

const BoardHome = () => {
  const [data, setData] = useState<initialDataInferface[]>([]);
  const [activeColumn, setActiveColumn] = useState<initialDataInferface | null>(
    null,
  );
  const [activeIssue, setActiveIssue] = useState<IssueItemProps | null>(null);
  const [chosedColumn, setChosedColumn] = useState<number | null>(null);
  const [user_id, setUserId] = useState<number>(0);
  const [username, setUsername] = useState<string>('');

  axios.defaults.baseURL = 'http://127.0.0.1:8080';
  useEffect(() => {
    axios
      .get('/taskboard/get/')
      .then(response => {
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get('/taskboard/getinfo/')
      .then(response => {
        console.log(response.data);
        setUserId(response.data['id']);
        setUsername(response.data['username']);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const Saving_data = (data: initialDataInferface[], user_id: number) => {
    axios
      .post('/taskboard/save', {
        data: data,
      })
      .then(response => {
        if (response.data == 'success') {
          alert('保存成功');
        }
      })
      .catch(error => {
        // 处理错误
        alert('保存失败');
      });
  };

  const Issue = (props: IssueProps) => {
    const { id, issueIndex, name } = props;
    const [isMouseDown, setIsMouseDown] = useState(false);

    return (
      <Draggable draggableId={`${id}`} index={issueIndex}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <div className={styles.issue}>
            <div
              ref={provided.innerRef}
              className={
                snapshot.isDragging
                  ? styles.issueDragging
                  : isMouseDown
                  ? styles.issuePress
                  : styles.issue
              }
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onMouseDown={() => {
                setIsMouseDown(true);
                console.log('mouse down');
              }}
              onMouseUp={() => {
                setIsMouseDown(false);
                console.log('mouse up');
              }}
              onClick={() => {
                setActiveIssue({
                  columnId: id,
                  issueId: issueIndex,
                });
              }}
            >
              {name}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  let issueIndex = 0;
  let columnIndex = 0;
  issueIndex = data.reduce((acc, column) => acc + column.issues.length, 0);
  columnIndex = data.length;

  const addIssue = (columnIndex: number) => {
    const Index: number = columnIndex;
    console.log(Index);
    const issueTemp = {
      id: issueIndex,
      name: '新任务',
      comments: [],
      urls: [],
      content: '新任务',
    };

    issueIndex++;
    const UpdatedData = update(data, {
      [Index]: {
        issues: issues =>
          update(issues, {
            $push: [issueTemp],
          }),
      },
    });
    setData(UpdatedData);
    console.log(data);
  };

  const Column = (props: ColumnProps) => {
    const { columnIndex, activeColumn, column } = props;
    const { id, issues } = column;
    console.log('activate column', activeColumn);
    console.log('id', id);
    const selectColumn = (Index: number) => {
      let INDEX = Index % 3;
      switch (INDEX) {
        case 0:
          return styles.todoColumn;
        case 1:
          return styles.doingColumn;
        case 2:
          return styles.doneColumn;
      }
    };
    return (
      <div
        className={selectColumn(columnIndex)}
        onDoubleClick={() => {
          addIssue(columnIndex);
          console.log(columnIndex);
        }}
      >
        <div
          className={styles.columnTitle}
          onDoubleClick={() => {
            setChosedColumn(columnIndex);
            console.log('Double Click');
          }}
        >
          {column.name}({column.issues.length})
        </div>
        <Droppable
          droppableId={`${columnIndex}`}
          mode="virtual"
          isDropDisabled={false}
          renderClone={(provided, snapshot, rubric) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={styles.issueDragging}
            >
              {column.issues[rubric.source.index].name}
            </div>
          )}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              className={
                snapshot.isDraggingOver
                  ? styles.columnContentActive
                  : styles.columnContent
              }
              {...provided.droppableProps}
            >
              {issues.map((issue, index) => (
                <Issue
                  key={issue.id}
                  issueIndex={index}
                  id={columnIndex}
                  name={issue.name}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  const addColumn = () => {
    const newColumn = {
      id: columnIndex,
      name: 'new column',
      issues: [],
    };
    const UpdatedData = update(data, {
      $push: [newColumn],
    });
    setData(UpdatedData);
  };

  const DropColumn = (isDroped: boolean) => {
    let columnId = chosedColumn;
    setChosedColumn(null);
    if (isDroped) {
      const UpdatedData = update(data, {
        $splice: [[columnId, 1]],
      });
      setData(UpdatedData);
    }
  };

  const DustBin = () => {
    return (
      <div className={styles.dustbin}>
        <div className={styles.columnTitle}>垃圾箱</div>
        <Droppable droppableId="99" isDropDisabled={false}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              className={
                snapshot.isDraggingOver
                  ? styles.dustbinContentActive
                  : styles.dustbinContent
              }
              {...provided.droppableProps}
            >
              {provided.placeholder}
              {!snapshot.isDraggingOver ? '请放入废弃任务' : '确认回收任务?'}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  const onDragStart = (result: DragUpdate) => {
    console.log('drag start');
    const { source } = result;
    const columnIndex = Number(source.droppableId);
    if (columnIndex != 0 && columnIndex != 1 && columnIndex != 2) {
      return;
    }
  };

  const onDragEnd = (result: DropResult) => {
    console.log('drag end');
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    const fromColumnIndex = Number(source.droppableId);
    const fromIssueIndex = source.index;
    const toColumnIndex = Number(destination.droppableId);
    const toIssueIndex = destination.index;
    console.log(fromColumnIndex, fromIssueIndex, toColumnIndex, toIssueIndex);
    const TempIssue = data[fromColumnIndex].issues[fromIssueIndex];

    if (fromColumnIndex === toColumnIndex) {
      return;
    }
    let TempData = update(data, {
      [fromColumnIndex]: {
        issues: issues =>
          update(issues, {
            $splice: [[fromIssueIndex, 1]],
          }),
      },
    });
    if (toColumnIndex === 99) {
      setData(TempData);
      setActiveColumn(null);
      return;
    }

    TempData = update(TempData, {
      [toColumnIndex]: {
        issues: issues =>
          update(issues, {
            $splice: [[toIssueIndex, 0, TempIssue]],
          }),
      },
    });

    setData(TempData);
    setActiveColumn(null);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <div className={styles.MainBody}>
        <DustBin />
        <div className={styles.header}>
          Task Board Total Columns: {data.length}
          <div className={styles.headerTitle}>
            from &ensp;
            {username}
            &ensp; id: {user_id}
            <button
              className={styles.button}
              onClick={() => {
                addColumn();
              }}
            >
              Adding Column
            </button>
            <button
              className={styles.button}
              onClick={() => {
                Saving_data(data, user_id);
              }}
            >
              Saving Data
            </button>
          </div>
        </div>
        <div className={styles.container}>
          {data.map((column, index) => {
            return (
              <Column
                columnIndex={index}
                key={column.id}
                activeColumn={activeColumn}
                column={column}
              />
            );
          })}

          {activeIssue && (
            <IssueItem
              columnId={activeIssue.columnId}
              issueId={activeIssue.issueId}
              data={data}
              onCancel={() => setActiveIssue(null)}
              onOk={() => setActiveIssue(null)}
              visilbe={activeIssue !== null}
              changeData={(newData: initialDataInferface[]) => {
                setData(newData);
                Saving_data(newData, user_id);
              }
            }
            />
          )}

          {chosedColumn !== null && (
            <RenameColumn
              columnId={chosedColumn}
              data={data}
              changeData={(newData: initialDataInferface[]) => setData(newData)}
              visible={chosedColumn !== null}
              setChosedColumn={setChosedColumn}
              DropColumn={DropColumn}
            />
          )}
        </div>
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
export { initialDataInferface };

import React, { memo, useState } from 'react';
import { Modal } from 'antd';
import update from 'immutability-helper';
import styles from './Modal.less';

type Modal1Props = {
  columnId: number;
  data: any;
  changeData: (data: any) => void;
  visible: boolean;
  setChosedColumn: (columnId: number | null) => void;
  DropColumn: (isDroped: boolean) => void;
};

const RenameColumn = memo<Modal1Props>(
  ({ columnId, data, changeData, visible, setChosedColumn, DropColumn }) => {
    const [copyData, setData] = useState(data);
    let isDroped: boolean = false;
    const Close = () => {
      DropColumn(isDroped);
    };
    const Save = () => {
      if (isDroped) {
        const UpdatedData = update(copyData, {
          $splice: [[columnId, 1]],
        });
        changeData(UpdatedData);
        return;
      }
      changeData(copyData);
    };
    return (
      <>
        <Modal
          title="IssueItem"
          visible={visible}
          onOk={() => {
            Save();

            alert('save success');
            Close();
          }}
          onCancel={() => {
            Close();
          }}
          className={styles.MainBudy}
        >
          <div>
            <div className={styles.container}>
              <text className={styles.text}>
                原先的项目名: {data[columnId].name}
              </text>
            </div>

            <div className={styles.container}>
              <text className={styles.text}>新的项目名:</text>
              <input
                placeholder="Enter new column name"
                onBlur={e => {
                  if (e.target.value === '') {
                    return;
                  }
                  const UpdatedData = update(copyData, {
                    [columnId]: {
                      name: {
                        $set: e.target.value,
                      },
                    },
                  });

                  setData(UpdatedData);
                }}
                className={styles.input}
                type="text"
                name="text"
              />
            </div>
            <div className={styles.container}>
              <text className={styles.text}>
                是否删除项目:
                <select
                  name="isDroped"
                  id="Droped"
                  defaultValue="false"
                  onChange={e => {
                    isDroped = e.target.value === 'true';
                  }}
                >
                  <option value="false">否</option>
                  <option value="true">是</option>
                </select>
              </text>
            </div>
          </div>
        </Modal>
      </>
    );
  },
);

export default RenameColumn;

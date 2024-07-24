import React, { memo, useState } from 'react';
import { Upload, message, Modal,Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import styles from './Modal.less';
import axios from 'axios';

type Modal1Props = {
  columnId: number;
  issueId: number;
  data: any;
  onOk: () => void;
  onCancel: () => void;
  visilbe: boolean;
  changeData: any;
};



const IssueItem = memo<Modal1Props>(
  ({ columnId, issueId, data, onCancel, onOk, visilbe, changeData }) => {
    const [copyData, setData] = useState(data);
    const wrapWithClose = (method?: () => void) => () => {
      method && method();
    };
    const Save = () => {
      changeData(copyData);
    };
    if(visilbe){
      axios.defaults.baseURL = "http://127.0.0.1:8080";
      axios.post("/taskboard/update",
        {
          columnId: columnId,
          issueId: issueId,
          
        }
      );
    }

    const props = {
      name: 'file',
      action: 'http://127.0.0.1:8080/taskboard/upload',
      onChange(info:any) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
          copyData[columnId].issues[issueId].urls.push("http://127.0.0.1:8080/upload/"+info.file.name);
          Save();
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <>
        <Modal
          title="任务详情"
          visible={visilbe}
          onOk={() => {
            Save();
            alert('save success');
            wrapWithClose(onOk);
          }}
          onCancel={wrapWithClose(onCancel)}
          className={styles.MainBudy}
        >
          <div>
            <div className={styles.container}>
              <text className={styles.text}>
                项目名称:{copyData[columnId].name}
              </text>
            </div>
            <div className={styles.container}>
              <text className={styles.text}>
                任务名称:
                <input
                  onBlur={e => {
                    if (e.target.value === '') {
                      return;
                    }
                    const UpdatedData = update(copyData, {
                      [columnId]: {
                        issues: {
                          [issueId]: {
                            name: {
                              $set: e.target.value,
                            },
                          },
                        },
                      },
                    });

                    setData(UpdatedData);
                  }}
                  placeholder={copyData[columnId].issues[issueId].name}
                  className={styles.input}
                />
              </text>
            </div>
            <div className={styles.container}>
              <text className={styles.text}>任务描述:</text>
              <textarea
                onBlur={e => {
                  if (e.target.value === '') {
                    return;
                  }
                  const UpdatedData = update(copyData, {
                    [columnId]: {
                      issues: {
                        [issueId]: {
                          content: {
                            $set: e.target.value,
                          },
                        },
                      },
                    },
                  });
                  setData(UpdatedData);
                }}
                placeholder={copyData[columnId].issues[issueId].content}
                className={styles.textarea}
              />
            </div>

            <div className={styles.container}>
              <text className={styles.text}>
                评论:
                {copyData[columnId].issues[issueId].comments.map(
                  (comment: string, index: number) => {
                    return (
                      <li>
                        第 {index + 1} 个: {comment}
                      </li>
                    );
                  },
                )}
                <form
                  onSubmit={(e: React.SyntheticEvent) => {
                    let comment = e.target[0].value;
                    e.preventDefault();
                    if (comment === '') {
                      return;
                    }

                    const UpdatedData = update(copyData, {
                      [columnId]: {
                        issues: {
                          [issueId]: {
                            comments: {
                              $push: [comment],
                            },
                          },
                        },
                      },
                    });
                    setData(UpdatedData);
                    e.target[0].value = '';
                  }}
                >
                  <input type="text" className={styles.input} />
                  <button type="submit">添加评论</button>
                </form>
              </text>
            </div>

            <div className={styles.container}>
              <text className={styles.text}>
                附加文件:
                {copyData[columnId].issues[issueId].urls.map(
                  (url: string, index: number) => {
                    return (
                      <li>
                        <a href={url} download={url}>
                          第 {index + 1} 个: {url.split('/').pop()}
                        </a>
                      </li>
                    );
                  },
                )}


              </text>
            </div>
            <Upload {...props} >
    <Button icon={<UploadOutlined />} className={styles.button}>添加附件</Button>
  </Upload>
          </div>
        </Modal>
      </>
    );
  },
);

export default IssueItem;

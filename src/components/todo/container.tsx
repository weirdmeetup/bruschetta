import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { observer } from 'mobx-react';
import React, { Component } from 'react';

import { isEmpty } from '../../utils/util';
import { IIssue } from './interface/IIssue';
import { TodoIssueInput } from './issue/input';
import TodoIssueItem from './issue/item';
import { calProgress } from './services/cal_progress';
import { TodoStore } from './store';

@observer
class TodoContainer extends Component {
  private store: TodoStore;

  constructor(props: object) {
    super(props);
    this.store = new TodoStore({ issues: [] });

    this.addIssue = this.addIssue.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.getIssueList = this.getIssueList.bind(this);
  }

  protected addIssue(data: IIssue) {
    this.store.addIssue(data);
  }

  protected handleChecked(params: { e: CheckboxChangeEvent; id: string }) {
    this.store.checkedIssue(params.id);
  }

  private getIssueList() {
    if (isEmpty(this.store) || isEmpty(this.store.Issues)) {
      return null;
    }
    const progressMap = calProgress([...this.store.Issues]);
    return this.store.Issues.map(mv => {
      const progress = progressMap.get(mv.id);
      const progressValue =
        !!progress && progress.total > 0
          ? Math.floor((progress.done / progress.total) * 100)
          : undefined;
      console.log(progressValue);
      return (
        <TodoIssueItem
          key={mv.id}
          handleChecked={this.handleChecked}
          progress={progressValue}
          {...mv}
        />
      );
    });
  }

  public render() {
    const displayIssueList = this.getIssueList();
    return (
      <div>
        <>{displayIssueList}</>
        <TodoIssueInput upsideDepth={0} handleDone={this.addIssue} />
      </div>
    );
  }
}

export default TodoContainer;

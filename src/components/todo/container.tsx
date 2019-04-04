import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { observer } from 'mobx-react';
import React, { Component } from 'react';

import { IIssue } from './interface/IIssue';
import { TodoIssueInput } from './issue/input';
import TodoIssueItem from './issue/item';
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
    return this.store.Issues.map(mv => (
      <TodoIssueItem key={mv.id} handleChecked={this.handleChecked} {...mv} />
    ));
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

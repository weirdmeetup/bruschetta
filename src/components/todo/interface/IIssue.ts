import { EN_ISSUE_TYPE } from './EN_ISSUE_TYPE';

export interface IIssue {
  text: string;
  type: EN_ISSUE_TYPE;
  depth: number;
}

export interface IIssueWithID extends IIssue {
  id: string;
}

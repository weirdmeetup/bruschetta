import * as debug from 'debug';

import { EN_ISSUE_TYPE } from '../interface/EN_ISSUE_TYPE';
import { IIssueWithID } from '../interface/IIssue';

const log = debug('br:cal_progress');

/** data를 받아서 progress map을 리턴한다. */
export function calProgress(data: IIssueWithID[]) {
  const progress = new Map<string, { total: number; done: number }>();
  data.reduce((acc, cur, idx) => {
    // desc는 고민할 필요없으니 바로 넘기자.
    if (cur.type === EN_ISSUE_TYPE.DESC) {
      return acc;
    }
    // map에 데이터가 없으면!
    if (progress.has(cur.id) === false) {
      // 기본값을 넣는다.
      progress.set(cur.id, { total: 0, done: 0 });
    }
    // 판단식을 생각해보자.
    const preData = data[idx - 1];
    const vector = idx === 0 ? 0 : preData.depth - cur.depth;
    log(idx, vector, cur.depth);

    // vector < 0 : 더 깊은 depth로 들어간 것. child 개념이 발생
    // vector === 0 : 변경 없음. 기존에 사용하던 곳에 task를 넣을지 말지 결정하면 됨
    // vector > 0 : 얕은 depth로 나온 것. 상위 값을 찾을 필요가 있다.
    const accKey = cur.depth.toString();
    const parentDepthKey = cur.depth !== 0 ? cur.depth - 1 : 0;

    // epic은 일단 등록하고 본다.
    if (cur.type === EN_ISSUE_TYPE.EPIC) {
      if (acc.has(accKey) === false) {
        acc.set(accKey, [
          { id: cur.id, idx, depth: cur.depth, type: EN_ISSUE_TYPE.EPIC }
        ]);
      } else {
        const updateAccData = [
          ...acc.get(accKey)!,
          { id: cur.id, idx, depth: cur.depth, type: EN_ISSUE_TYPE.EPIC }
        ];
        acc.set(accKey, updateAccData);
      }
    }

    // vector 변경이 있는데, 아무런 값이 설정되지 않은 경우
    if (vector !== 0 && acc.has(accKey) === false) {
      acc.set(accKey, [{ id: cur.id, idx, depth: cur.depth, type: cur.type }]);
    }

    if (vector < 0) {
      const preDataAccKey = preData.depth.toString();
      // predata가 task를 가질 수 있게 된다.
      if (acc.has(preDataAccKey) === false) {
        acc.set(preDataAccKey, [
          {
            id: preData.id,
            idx: idx - 1,
            depth: preData.depth,
            type: preData.type
          }
        ]);
      } else {
        // 기존에 정보가 있을 수 있다.
        const preDataFromAcc = acc
          .get(preDataAccKey)!
          .findIndex(fv => fv.id === preData.id);
        if (preDataFromAcc < 0) {
          const updateAccData = [
            ...acc.get(preDataAccKey)!,
            {
              id: preData.id,
              idx: idx - 1,
              depth: preData.depth,
              type: preData.type
            }
          ];
          acc.set(preDataAccKey, updateAccData);
        }
      }
      const accData = acc.get(preDataAccKey)!.sort((a, b) => b.idx - a.idx)[0];
      updateProgress(progress, accData, cur);
    }

    if (vector > 0) {
      const updateAccData = [
        ...acc.get(accKey)!,
        { id: cur.id, idx, depth: cur.depth, type: cur.type }
      ];
      acc.set(accKey, updateAccData);

      // 자기가 depth 0이 아닌가?
      if (cur.depth !== 0) {
        const accData = acc
          .get(`${parentDepthKey}`)!
          .sort((a, b) => b.idx - a.idx)[0];
        updateProgress(progress, accData, cur);
      }
    }

    if (vector === 0 && cur.depth !== 0) {
      const accData = acc
        .get(`${parentDepthKey}`)!
        .sort((a, b) => b.idx - a.idx)[0];
      updateProgress(progress, accData, cur);
    }

    // depth 0이며 task
    if (cur.depth === 0 && cur.type === EN_ISSUE_TYPE.TASK && acc.has('0')) {
      // epic 이 기존에 있는지 확인한다.
      const accDataArr = acc
        .get('0')!
        .filter(fv => fv.type === EN_ISSUE_TYPE.EPIC)
        .sort((a, b) => b.idx - a.idx);
      if (accDataArr.length > 0) {
        log(cur.id);
        updateProgress(progress, accDataArr[0], cur);
      }
    }

    return acc;
    // tslint:disable-next-line: align
  }, new Map<string, Array<{ id: string; idx: number; depth: number; type: EN_ISSUE_TYPE }>>());
  return progress;
}
function updateProgress(
  progress: Map<string, { total: number; done: number }>,
  accData: { id: string; idx: number; depth: number },
  cur: IIssueWithID
) {
  const processData = { ...progress.get(accData.id)! };
  processData.total += 1;
  processData.done += /^\[(x|X)\]/.test(cur.text) ? 1 : 0;
  progress.set(accData.id, processData);
}

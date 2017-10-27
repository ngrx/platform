import * as _ from 'lodash';

export interface ActionInterfaceProperty {
  name: string;
  required: boolean;
}

export interface ActionInterface {
  name: string;
  actionType: string;
  properties: ActionInterfaceProperty[];
}

const actionTypeRegex = new RegExp(/\[(.*?)\](.*)/);
function parseActionType(type: string) {
  const result = actionTypeRegex.exec(type);

  if (result === null) {
    throw new Error(`Could not parse action type "${type}"`);
  }

  return {
    category: result[1] as string,
    name: result[2] as string,
  };
}

export const getActionType = (enterface: ActionInterface) =>
  enterface.actionType;
export const getActionName = (enterface: ActionInterface) => enterface.name;
export const getActionCategory = _.flow(
  getActionType,
  parseActionType,
  v => v.category
);
export const getActionCategoryToken = _.flow(
  getActionCategory,
  _.camelCase,
  _.upperFirst
);
export const getActionEnumName = _.flow(
  getActionCategoryToken,
  v => `${v}ActionType`
);
export const getActionEnumPropName = _.flow(getActionName, _.snakeCase, v =>
  v.toUpperCase()
);
export const getActionUnionName = _.flow(
  getActionCategoryToken,
  v => `${v}Actions`
);
export const getActionLookupName = _.flow(
  getActionCategoryToken,
  v => `${v}ActionLookup`
);
export const getActionFactoryName = _.flow(
  getActionName,
  _.camelCase,
  _.upperFirst,
  v => `create${v}`
);

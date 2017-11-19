export interface ActionInterfaceProperty {
    name: string;
    required: boolean;
}
export interface ActionInterface {
    name: string;
    actionType: string;
    properties: ActionInterfaceProperty[];
}
export declare const getActionType: (enterface: ActionInterface) => string;
export declare const getActionName: (enterface: ActionInterface) => string;
export declare const getActionCategory: (a1: ActionInterface) => string;
export declare const getActionCategoryToken: (a1: ActionInterface) => string;
export declare const getActionEnumName: (a1: ActionInterface) => string;
export declare const getActionEnumPropName: (a1: ActionInterface) => string;
export declare const getActionUnionName: (a1: ActionInterface) => string;
export declare const getActionLookupName: (a1: ActionInterface) => string;
export declare const getActionFactoryName: (a1: ActionInterface) => string;

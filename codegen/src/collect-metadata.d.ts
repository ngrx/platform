import * as ts from 'typescript';
export interface ActionMetadata {
    name: string;
    type: string;
    properties: {
        name: string;
        optional: boolean;
    }[];
}
export declare function collectMetadata(fileName: string, sourceFile: ts.SourceFile): ts.Node[] | undefined;
export declare function printActionFactory(ast: ts.Node[]): string;

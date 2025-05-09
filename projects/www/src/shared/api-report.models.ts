export enum ApiMemberKind {
  EntryPoint = 'EntryPoint',
  Function = 'Function',
  Class = 'Class',
  TypeAlias = 'TypeAlias',
  Interface = 'Interface',
  Enum = 'Enum',
  Variable = 'Variable',
  Property = 'Property',
  Method = 'Method',
}

export enum ApiExcerptTokenKind {
  Content = 'Content',
  Reference = 'Reference',
}

export enum ApiReleaseTag {
  Public = 'Public',
  Beta = 'Beta',
  Alpha = 'Alpha',
  Internal = 'Internal',
}

export type CanonicalReferenceKind =
  | 'var'
  | 'function'
  | 'class'
  | 'interface'
  | 'enum'
  | 'type'
  | 'member';

export type CanonicalReference =
  | `${string}!${string}:${CanonicalReferenceKind}`
  | `${string}!${string}:${CanonicalReferenceKind}(${number})`
  | `${string}!~${string}:${CanonicalReferenceKind}`
  | `${string}!~${string}:${CanonicalReferenceKind}(${number})`;

export class ParsedCanonicalReference {
  readonly package: string;
  readonly name: string;
  readonly kind: CanonicalReferenceKind;
  readonly index: number | undefined;
  readonly isPrivate: boolean;

  constructor(readonly referenceString: CanonicalReference) {
    const [packagePart, restOfParts] = referenceString.split('!');

    this.package = packagePart === '' ? '@@internal' : packagePart;

    const [symbolName, kindParts] = restOfParts.split(':');
    if (!symbolName || !kindParts) {
      throw new Error(`Invalid reference: ${referenceString}`);
    }

    this.name = symbolName;
    const [memberKind, countWithClosingParens] = kindParts.split('(');

    this.kind = memberKind as CanonicalReferenceKind;

    if (countWithClosingParens) {
      this.index = parseInt(countWithClosingParens.slice(0, -1));
    }

    this.isPrivate = this.name.startsWith('~') || this.package === '@@internal';
  }
}

export interface ApiContentExcerptToken {
  kind: ApiExcerptTokenKind.Content;
  text: string;
}

export interface ApiReferenceExcerptToken {
  kind: ApiExcerptTokenKind.Reference;
  text: string;
  canonicalReference: CanonicalReference;
}

export type ApiExcerptToken = ApiContentExcerptToken | ApiReferenceExcerptToken;

export interface ApiDocs {
  modifiers: {
    isInternal: boolean;
    isPublic: boolean;
    isAlpha: boolean;
    isBeta: boolean;
    isOverride: boolean;
    isExperimental: boolean;
  };
  summary: string;
  usageNotes: string;
  remarks: string;
  deprecated: string;
  returns: string;
  see: string[];
  params: { name: string; description: string }[];
}

export interface ApiTokenRange {
  startIndex: number;
  endIndex: number;
}

export interface ApiMemberParam {
  parameterName: string;
  isOptional: boolean;
  parameterTypeTokenRange: ApiTokenRange;
}

export interface ApiMemberTypeParam {
  typeParameterName: string;
  constraintTokenRange: ApiTokenRange;
  defaultTypeTokenRange: ApiTokenRange;
}

export interface ApiMember {
  kind: ApiMemberKind;
  name: string;
  canonicalReference: CanonicalReference;
  docComment: string;
  fileUrlPath: string;
  isStatic?: boolean;
  returnTypeTokenRange?: ApiTokenRange;
  typeTokenRange?: ApiTokenRange;
  variableTypeTokenRange?: ApiTokenRange;
  releaseTag: ApiReleaseTag;
  excerptTokens: ApiExcerptToken[];
  members?: ApiMember[];
  parameters?: ApiMemberParam[];
  typeParameters?: ApiMemberTypeParam[];
  docs: ApiDocs;
}

export interface ApiMemberSummary {
  kind: ApiMemberKind;
  name: string;
  canonicalReference: CanonicalReference;
  fileUrlPath: string;
  isDeprecated: boolean;
  members: ApiMember[];
}

export type MinimizedApiMemberSummary = Omit<
  ApiMemberSummary,
  'members' | 'fileUrlPath'
>;

export interface ApiReport {
  symbolNames: string[];
  symbols: {
    [symbolName: string]: ApiMemberSummary;
  };
}

export interface ApiPackageReport {
  packageNames: string[];
  packages: {
    [packageName: string]: ApiReport;
  };
}

export interface MinimizedApiReport {
  symbolNames: string[];
  symbols: {
    [symbolName: string]: MinimizedApiMemberSummary;
  };
}

export interface MinimizedApiPackageReport {
  packageNames: string[];
  packages: {
    [packageName: string]: MinimizedApiReport;
  };
}

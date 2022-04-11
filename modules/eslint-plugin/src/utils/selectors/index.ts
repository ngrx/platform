export const effectCreator = `PropertyDefinition[value.callee.name='createEffect']`;
export const createEffectExpression = `CallExpression[callee.name='createEffect']`;

export const effectDecorator = `Decorator[expression.callee.name='Effect']`;
export const propertyDefinitionWithEffectDecorator =
  `ClassDeclaration > ClassBody > PropertyDefinition > ${effectDecorator}` as const;

export const actionCreator = `CallExpression[callee.name='createAction']`;
export const actionCreatorWithLiteral =
  `${actionCreator}[arguments.0.type='Literal'][arguments.0.raw=/^'/]` as const;
export const actionCreatorProps =
  `${actionCreator} > CallExpression[callee.name='props']` as const;
export const actionCreatorPropsComputed =
  `${actionCreatorProps} > TSTypeParameterInstantiation > :matches(TSTypeReference[typeName.name!='Readonly'], [type=/^TS(.*)(Keyword|Type)$/])` as const;

export const constructorDefinition = `MethodDefinition[kind='constructor']`;

export function metadataProperty(key: RegExp): string;
export function metadataProperty<TKey extends string>(
  key: TKey
): `Property:matches([key.name=${TKey}][computed=false], [key.value=${TKey}], [key.quasis.0.value.raw=${TKey}])`;
export function metadataProperty(key: RegExp | string): string {
  return `Property:matches([key.name=${key}][computed=false], [key.value=${key}], [key.quasis.0.value.raw=${key}])`;
}

export const ngModuleDecorator = `ClassDeclaration > Decorator > CallExpression[callee.name='NgModule']`;

export const ngModuleImports =
  `${ngModuleDecorator} ObjectExpression ${metadataProperty(
    'imports'
  )} > ArrayExpression` as const;

export const ngModuleProviders =
  `${ngModuleDecorator} ObjectExpression ${metadataProperty(
    'providers'
  )} > ArrayExpression` as const;

export const effectsInNgModuleImports =
  `${ngModuleImports} CallExpression[callee.object.name='EffectsModule'][callee.property.name=/^for(Root|Feature)$/] ArrayExpression > Identifier` as const;

export const effectsInNgModuleProviders =
  `${ngModuleProviders} Identifier` as const;

export const namedExpression = (name: RegExp | string) =>
  `:matches(${constructorDefinition} CallExpression[callee.object.name=${name}], CallExpression[callee.object.object.type='ThisExpression'][callee.object.property.name=${name}])` as const;

export const namedCallableExpression = (name: RegExp | string) =>
  `:matches(${namedExpression(
    name
  )}, ${constructorDefinition} CallExpression[callee.object.callee.object.name=${name}], CallExpression[callee.object.callee.object.object.type='ThisExpression'][callee.object.callee.object.property.name=${name}])` as const;

export const pipeExpression = (name: RegExp | string) =>
  `${namedExpression(name)}[callee.property.name='pipe']` as const;

export const pipeableSelect = (name: RegExp | string) =>
  `${pipeExpression(name)} CallExpression[callee.name='select']` as const;

export const selectExpression = (name: RegExp | string) =>
  `${namedExpression(name)}[callee.property.name='select']` as const;

export const dispatchExpression = (name: RegExp | string) =>
  `${namedExpression(name)}[callee.property.name='dispatch']` as const;

export const dispatchInEffects = (name: RegExp | string) =>
  `${createEffectExpression} ${dispatchExpression(
    name
  )} > MemberExpression:has(Identifier[name=${name}])` as const;

export const createReducer = `CallExpression[callee.name='createReducer']`;

export const onFunctionWithoutType =
  `${createReducer} CallExpression[callee.name='on'] > ArrowFunctionExpression:not([returnType.typeAnnotation], :has(CallExpression))` as const;

export const storeActionReducerMap =
  `${ngModuleImports} CallExpression[callee.object.name='StoreModule'][callee.property.name=/^for(Root|Feature)$/] > ObjectExpression:first-child` as const;

export const actionReducerMap = `VariableDeclarator[id.typeAnnotation.typeAnnotation.typeName.name='ActionReducerMap'] > ObjectExpression`;

const mapLikeOperators = '/^(concat|exhaust|flat|merge|switch)Map$/';
const mapLikeToOperators = '/^(concat|merge|switch)MapTo$/';
export const mapLikeOperatorsExplicitReturn =
  `CallExpression[callee.name=${mapLikeOperators}] ReturnStatement` as const;
export const mapLikeOperatorsImplicitReturn =
  `:matches(CallExpression[callee.name=${mapLikeToOperators}], CallExpression[callee.name=${mapLikeOperators}] > ArrowFunctionExpression)` as const;

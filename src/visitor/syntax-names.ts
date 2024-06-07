import ts from 'typescript'
import { BuilderBinaryOp, BuilderComparisonOp, BuilderUnaryOp } from '../awst_build/eb'

export const SyntaxKindName = {
  [ts.SyntaxKind.Unknown]: 'Unknown',
  [ts.SyntaxKind.EndOfFileToken]: 'EndOfFileToken',
  [ts.SyntaxKind.SingleLineCommentTrivia]: 'SingleLineCommentTrivia',
  [ts.SyntaxKind.MultiLineCommentTrivia]: 'MultiLineCommentTrivia',
  [ts.SyntaxKind.NewLineTrivia]: 'NewLineTrivia',
  [ts.SyntaxKind.WhitespaceTrivia]: 'WhitespaceTrivia',
  [ts.SyntaxKind.ShebangTrivia]: 'ShebangTrivia',
  [ts.SyntaxKind.ConflictMarkerTrivia]: 'ConflictMarkerTrivia',
  [ts.SyntaxKind.NonTextFileMarkerTrivia]: 'NonTextFileMarkerTrivia',
  [ts.SyntaxKind.NumericLiteral]: 'NumericLiteral',
  [ts.SyntaxKind.BigIntLiteral]: 'BigIntLiteral',
  [ts.SyntaxKind.StringLiteral]: 'StringLiteral',
  [ts.SyntaxKind.JsxText]: 'JsxText',
  [ts.SyntaxKind.JsxTextAllWhiteSpaces]: 'JsxTextAllWhiteSpaces',
  [ts.SyntaxKind.RegularExpressionLiteral]: 'RegularExpressionLiteral',
  [ts.SyntaxKind.NoSubstitutionTemplateLiteral]: 'NoSubstitutionTemplateLiteral',
  [ts.SyntaxKind.TemplateHead]: 'TemplateHead',
  [ts.SyntaxKind.TemplateMiddle]: 'TemplateMiddle',
  [ts.SyntaxKind.TemplateTail]: 'TemplateTail',
  [ts.SyntaxKind.OpenBraceToken]: 'OpenBraceToken',
  [ts.SyntaxKind.CloseBraceToken]: 'CloseBraceToken',
  [ts.SyntaxKind.OpenParenToken]: 'OpenParenToken',
  [ts.SyntaxKind.CloseParenToken]: 'CloseParenToken',
  [ts.SyntaxKind.OpenBracketToken]: 'OpenBracketToken',
  [ts.SyntaxKind.CloseBracketToken]: 'CloseBracketToken',
  [ts.SyntaxKind.DotToken]: 'DotToken',
  [ts.SyntaxKind.DotDotDotToken]: 'DotDotDotToken',
  [ts.SyntaxKind.SemicolonToken]: 'SemicolonToken',
  [ts.SyntaxKind.CommaToken]: 'CommaToken',
  [ts.SyntaxKind.QuestionDotToken]: 'QuestionDotToken',
  [ts.SyntaxKind.LessThanToken]: 'LessThanToken',
  [ts.SyntaxKind.LessThanSlashToken]: 'LessThanSlashToken',
  [ts.SyntaxKind.GreaterThanToken]: 'GreaterThanToken',
  [ts.SyntaxKind.LessThanEqualsToken]: 'LessThanEqualsToken',
  [ts.SyntaxKind.GreaterThanEqualsToken]: 'GreaterThanEqualsToken',
  [ts.SyntaxKind.EqualsEqualsToken]: 'EqualsEqualsToken',
  [ts.SyntaxKind.ExclamationEqualsToken]: 'ExclamationEqualsToken',
  [ts.SyntaxKind.EqualsEqualsEqualsToken]: 'EqualsEqualsEqualsToken',
  [ts.SyntaxKind.ExclamationEqualsEqualsToken]: 'ExclamationEqualsEqualsToken',
  [ts.SyntaxKind.EqualsGreaterThanToken]: 'EqualsGreaterThanToken',
  [ts.SyntaxKind.PlusToken]: 'PlusToken',
  [ts.SyntaxKind.MinusToken]: 'MinusToken',
  [ts.SyntaxKind.AsteriskToken]: 'AsteriskToken',
  [ts.SyntaxKind.AsteriskAsteriskToken]: 'AsteriskAsteriskToken',
  [ts.SyntaxKind.SlashToken]: 'SlashToken',
  [ts.SyntaxKind.PercentToken]: 'PercentToken',
  [ts.SyntaxKind.PlusPlusToken]: 'PlusPlusToken',
  [ts.SyntaxKind.MinusMinusToken]: 'MinusMinusToken',
  [ts.SyntaxKind.LessThanLessThanToken]: 'LessThanLessThanToken',
  [ts.SyntaxKind.GreaterThanGreaterThanToken]: 'GreaterThanGreaterThanToken',
  [ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken]: 'GreaterThanGreaterThanGreaterThanToken',
  [ts.SyntaxKind.AmpersandToken]: 'AmpersandToken',
  [ts.SyntaxKind.BarToken]: 'BarToken',
  [ts.SyntaxKind.CaretToken]: 'CaretToken',
  [ts.SyntaxKind.ExclamationToken]: 'ExclamationToken',
  [ts.SyntaxKind.TildeToken]: 'TildeToken',
  [ts.SyntaxKind.AmpersandAmpersandToken]: 'AmpersandAmpersandToken',
  [ts.SyntaxKind.BarBarToken]: 'BarBarToken',
  [ts.SyntaxKind.QuestionToken]: 'QuestionToken',
  [ts.SyntaxKind.ColonToken]: 'ColonToken',
  [ts.SyntaxKind.AtToken]: 'AtToken',
  [ts.SyntaxKind.QuestionQuestionToken]: 'QuestionQuestionToken',
  [ts.SyntaxKind.BacktickToken]: 'BacktickToken',
  [ts.SyntaxKind.HashToken]: 'HashToken',
  [ts.SyntaxKind.EqualsToken]: 'EqualsToken',
  [ts.SyntaxKind.PlusEqualsToken]: 'PlusEqualsToken',
  [ts.SyntaxKind.MinusEqualsToken]: 'MinusEqualsToken',
  [ts.SyntaxKind.AsteriskEqualsToken]: 'AsteriskEqualsToken',
  [ts.SyntaxKind.AsteriskAsteriskEqualsToken]: 'AsteriskAsteriskEqualsToken',
  [ts.SyntaxKind.SlashEqualsToken]: 'SlashEqualsToken',
  [ts.SyntaxKind.PercentEqualsToken]: 'PercentEqualsToken',
  [ts.SyntaxKind.LessThanLessThanEqualsToken]: 'LessThanLessThanEqualsToken',
  [ts.SyntaxKind.GreaterThanGreaterThanEqualsToken]: 'GreaterThanGreaterThanEqualsToken',
  [ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken]: 'GreaterThanGreaterThanGreaterThanEqualsToken',
  [ts.SyntaxKind.AmpersandEqualsToken]: 'AmpersandEqualsToken',
  [ts.SyntaxKind.BarEqualsToken]: 'BarEqualsToken',
  [ts.SyntaxKind.BarBarEqualsToken]: 'BarBarEqualsToken',
  [ts.SyntaxKind.AmpersandAmpersandEqualsToken]: 'AmpersandAmpersandEqualsToken',
  [ts.SyntaxKind.QuestionQuestionEqualsToken]: 'QuestionQuestionEqualsToken',
  [ts.SyntaxKind.CaretEqualsToken]: 'CaretEqualsToken',
  [ts.SyntaxKind.Identifier]: 'Identifier',
  [ts.SyntaxKind.PrivateIdentifier]: 'PrivateIdentifier',
  [ts.SyntaxKind.BreakKeyword]: 'BreakKeyword',
  [ts.SyntaxKind.CaseKeyword]: 'CaseKeyword',
  [ts.SyntaxKind.CatchKeyword]: 'CatchKeyword',
  [ts.SyntaxKind.ClassKeyword]: 'ClassKeyword',
  [ts.SyntaxKind.ConstKeyword]: 'ConstKeyword',
  [ts.SyntaxKind.ContinueKeyword]: 'ContinueKeyword',
  [ts.SyntaxKind.DebuggerKeyword]: 'DebuggerKeyword',
  [ts.SyntaxKind.DefaultKeyword]: 'DefaultKeyword',
  [ts.SyntaxKind.DeleteKeyword]: 'DeleteKeyword',
  [ts.SyntaxKind.DoKeyword]: 'DoKeyword',
  [ts.SyntaxKind.ElseKeyword]: 'ElseKeyword',
  [ts.SyntaxKind.EnumKeyword]: 'EnumKeyword',
  [ts.SyntaxKind.ExportKeyword]: 'ExportKeyword',
  [ts.SyntaxKind.ExtendsKeyword]: 'ExtendsKeyword',
  [ts.SyntaxKind.FalseKeyword]: 'FalseKeyword',
  [ts.SyntaxKind.FinallyKeyword]: 'FinallyKeyword',
  [ts.SyntaxKind.ForKeyword]: 'ForKeyword',
  [ts.SyntaxKind.FunctionKeyword]: 'FunctionKeyword',
  [ts.SyntaxKind.IfKeyword]: 'IfKeyword',
  [ts.SyntaxKind.ImportKeyword]: 'ImportKeyword',
  [ts.SyntaxKind.InKeyword]: 'InKeyword',
  [ts.SyntaxKind.InstanceOfKeyword]: 'InstanceOfKeyword',
  [ts.SyntaxKind.NewKeyword]: 'NewKeyword',
  [ts.SyntaxKind.NullKeyword]: 'NullKeyword',
  [ts.SyntaxKind.ReturnKeyword]: 'ReturnKeyword',
  [ts.SyntaxKind.SuperKeyword]: 'SuperKeyword',
  [ts.SyntaxKind.SwitchKeyword]: 'SwitchKeyword',
  [ts.SyntaxKind.ThisKeyword]: 'ThisKeyword',
  [ts.SyntaxKind.ThrowKeyword]: 'ThrowKeyword',
  [ts.SyntaxKind.TrueKeyword]: 'TrueKeyword',
  [ts.SyntaxKind.TryKeyword]: 'TryKeyword',
  [ts.SyntaxKind.TypeOfKeyword]: 'TypeOfKeyword',
  [ts.SyntaxKind.VarKeyword]: 'VarKeyword',
  [ts.SyntaxKind.VoidKeyword]: 'VoidKeyword',
  [ts.SyntaxKind.WhileKeyword]: 'WhileKeyword',
  [ts.SyntaxKind.WithKeyword]: 'WithKeyword',
  [ts.SyntaxKind.ImplementsKeyword]: 'ImplementsKeyword',
  [ts.SyntaxKind.InterfaceKeyword]: 'InterfaceKeyword',
  [ts.SyntaxKind.LetKeyword]: 'LetKeyword',
  [ts.SyntaxKind.PackageKeyword]: 'PackageKeyword',
  [ts.SyntaxKind.PrivateKeyword]: 'PrivateKeyword',
  [ts.SyntaxKind.ProtectedKeyword]: 'ProtectedKeyword',
  [ts.SyntaxKind.PublicKeyword]: 'PublicKeyword',
  [ts.SyntaxKind.StaticKeyword]: 'StaticKeyword',
  [ts.SyntaxKind.YieldKeyword]: 'YieldKeyword',
  [ts.SyntaxKind.AbstractKeyword]: 'AbstractKeyword',
  [ts.SyntaxKind.AccessorKeyword]: 'AccessorKeyword',
  [ts.SyntaxKind.AsKeyword]: 'AsKeyword',
  [ts.SyntaxKind.AssertsKeyword]: 'AssertsKeyword',
  [ts.SyntaxKind.AssertKeyword]: 'AssertKeyword',
  [ts.SyntaxKind.AnyKeyword]: 'AnyKeyword',
  [ts.SyntaxKind.AsyncKeyword]: 'AsyncKeyword',
  [ts.SyntaxKind.AwaitKeyword]: 'AwaitKeyword',
  [ts.SyntaxKind.BooleanKeyword]: 'BooleanKeyword',
  [ts.SyntaxKind.ConstructorKeyword]: 'ConstructorKeyword',
  [ts.SyntaxKind.DeclareKeyword]: 'DeclareKeyword',
  [ts.SyntaxKind.GetKeyword]: 'GetKeyword',
  [ts.SyntaxKind.InferKeyword]: 'InferKeyword',
  [ts.SyntaxKind.IntrinsicKeyword]: 'IntrinsicKeyword',
  [ts.SyntaxKind.IsKeyword]: 'IsKeyword',
  [ts.SyntaxKind.KeyOfKeyword]: 'KeyOfKeyword',
  [ts.SyntaxKind.ModuleKeyword]: 'ModuleKeyword',
  [ts.SyntaxKind.NamespaceKeyword]: 'NamespaceKeyword',
  [ts.SyntaxKind.NeverKeyword]: 'NeverKeyword',
  [ts.SyntaxKind.OutKeyword]: 'OutKeyword',
  [ts.SyntaxKind.ReadonlyKeyword]: 'ReadonlyKeyword',
  [ts.SyntaxKind.RequireKeyword]: 'RequireKeyword',
  [ts.SyntaxKind.NumberKeyword]: 'NumberKeyword',
  [ts.SyntaxKind.ObjectKeyword]: 'ObjectKeyword',
  [ts.SyntaxKind.SatisfiesKeyword]: 'SatisfiesKeyword',
  [ts.SyntaxKind.SetKeyword]: 'SetKeyword',
  [ts.SyntaxKind.StringKeyword]: 'StringKeyword',
  [ts.SyntaxKind.SymbolKeyword]: 'SymbolKeyword',
  [ts.SyntaxKind.TypeKeyword]: 'TypeKeyword',
  [ts.SyntaxKind.UndefinedKeyword]: 'UndefinedKeyword',
  [ts.SyntaxKind.UniqueKeyword]: 'UniqueKeyword',
  [ts.SyntaxKind.UnknownKeyword]: 'UnknownKeyword',
  [ts.SyntaxKind.UsingKeyword]: 'UsingKeyword',
  [ts.SyntaxKind.FromKeyword]: 'FromKeyword',
  [ts.SyntaxKind.GlobalKeyword]: 'GlobalKeyword',
  [ts.SyntaxKind.BigIntKeyword]: 'BigIntKeyword',
  [ts.SyntaxKind.OverrideKeyword]: 'OverrideKeyword',
  [ts.SyntaxKind.OfKeyword]: 'OfKeyword',
  [ts.SyntaxKind.QualifiedName]: 'QualifiedName',
  [ts.SyntaxKind.ComputedPropertyName]: 'ComputedPropertyName',
  [ts.SyntaxKind.TypeParameter]: 'TypeParameter',
  [ts.SyntaxKind.Parameter]: 'Parameter',
  [ts.SyntaxKind.Decorator]: 'Decorator',
  [ts.SyntaxKind.PropertySignature]: 'PropertySignature',
  [ts.SyntaxKind.PropertyDeclaration]: 'PropertyDeclaration',
  [ts.SyntaxKind.MethodSignature]: 'MethodSignature',
  [ts.SyntaxKind.MethodDeclaration]: 'MethodDeclaration',
  [ts.SyntaxKind.ClassStaticBlockDeclaration]: 'ClassStaticBlockDeclaration',
  [ts.SyntaxKind.Constructor]: 'Constructor',
  [ts.SyntaxKind.GetAccessor]: 'GetAccessor',
  [ts.SyntaxKind.SetAccessor]: 'SetAccessor',
  [ts.SyntaxKind.CallSignature]: 'CallSignature',
  [ts.SyntaxKind.ConstructSignature]: 'ConstructSignature',
  [ts.SyntaxKind.IndexSignature]: 'IndexSignature',
  [ts.SyntaxKind.TypePredicate]: 'TypePredicate',
  [ts.SyntaxKind.TypeReference]: 'TypeReference',
  [ts.SyntaxKind.FunctionType]: 'FunctionType',
  [ts.SyntaxKind.ConstructorType]: 'ConstructorType',
  [ts.SyntaxKind.TypeQuery]: 'TypeQuery',
  [ts.SyntaxKind.TypeLiteral]: 'TypeLiteral',
  [ts.SyntaxKind.ArrayType]: 'ArrayType',
  [ts.SyntaxKind.TupleType]: 'TupleType',
  [ts.SyntaxKind.OptionalType]: 'OptionalType',
  [ts.SyntaxKind.RestType]: 'RestType',
  [ts.SyntaxKind.UnionType]: 'UnionType',
  [ts.SyntaxKind.IntersectionType]: 'IntersectionType',
  [ts.SyntaxKind.ConditionalType]: 'ConditionalType',
  [ts.SyntaxKind.InferType]: 'InferType',
  [ts.SyntaxKind.ParenthesizedType]: 'ParenthesizedType',
  [ts.SyntaxKind.ThisType]: 'ThisType',
  [ts.SyntaxKind.TypeOperator]: 'TypeOperator',
  [ts.SyntaxKind.IndexedAccessType]: 'IndexedAccessType',
  [ts.SyntaxKind.MappedType]: 'MappedType',
  [ts.SyntaxKind.LiteralType]: 'LiteralType',
  [ts.SyntaxKind.NamedTupleMember]: 'NamedTupleMember',
  [ts.SyntaxKind.TemplateLiteralType]: 'TemplateLiteralType',
  [ts.SyntaxKind.TemplateLiteralTypeSpan]: 'TemplateLiteralTypeSpan',
  [ts.SyntaxKind.ImportType]: 'ImportType',
  [ts.SyntaxKind.ObjectBindingPattern]: 'ObjectBindingPattern',
  [ts.SyntaxKind.ArrayBindingPattern]: 'ArrayBindingPattern',
  [ts.SyntaxKind.BindingElement]: 'BindingElement',
  [ts.SyntaxKind.ArrayLiteralExpression]: 'ArrayLiteralExpression',
  [ts.SyntaxKind.ObjectLiteralExpression]: 'ObjectLiteralExpression',
  [ts.SyntaxKind.PropertyAccessExpression]: 'PropertyAccessExpression',
  [ts.SyntaxKind.ElementAccessExpression]: 'ElementAccessExpression',
  [ts.SyntaxKind.CallExpression]: 'CallExpression',
  [ts.SyntaxKind.NewExpression]: 'NewExpression',
  [ts.SyntaxKind.TaggedTemplateExpression]: 'TaggedTemplateExpression',
  [ts.SyntaxKind.TypeAssertionExpression]: 'TypeAssertionExpression',
  [ts.SyntaxKind.ParenthesizedExpression]: 'ParenthesizedExpression',
  [ts.SyntaxKind.FunctionExpression]: 'FunctionExpression',
  [ts.SyntaxKind.ArrowFunction]: 'ArrowFunction',
  [ts.SyntaxKind.DeleteExpression]: 'DeleteExpression',
  [ts.SyntaxKind.TypeOfExpression]: 'TypeOfExpression',
  [ts.SyntaxKind.VoidExpression]: 'VoidExpression',
  [ts.SyntaxKind.AwaitExpression]: 'AwaitExpression',
  [ts.SyntaxKind.PrefixUnaryExpression]: 'PrefixUnaryExpression',
  [ts.SyntaxKind.PostfixUnaryExpression]: 'PostfixUnaryExpression',
  [ts.SyntaxKind.BinaryExpression]: 'BinaryExpression',
  [ts.SyntaxKind.ConditionalExpression]: 'ConditionalExpression',
  [ts.SyntaxKind.TemplateExpression]: 'TemplateExpression',
  [ts.SyntaxKind.YieldExpression]: 'YieldExpression',
  [ts.SyntaxKind.SpreadElement]: 'SpreadElement',
  [ts.SyntaxKind.ClassExpression]: 'ClassExpression',
  [ts.SyntaxKind.OmittedExpression]: 'OmittedExpression',
  [ts.SyntaxKind.ExpressionWithTypeArguments]: 'ExpressionWithTypeArguments',
  [ts.SyntaxKind.AsExpression]: 'AsExpression',
  [ts.SyntaxKind.NonNullExpression]: 'NonNullExpression',
  [ts.SyntaxKind.MetaProperty]: 'MetaProperty',
  [ts.SyntaxKind.SyntheticExpression]: 'SyntheticExpression',
  [ts.SyntaxKind.SatisfiesExpression]: 'SatisfiesExpression',
  [ts.SyntaxKind.TemplateSpan]: 'TemplateSpan',
  [ts.SyntaxKind.SemicolonClassElement]: 'SemicolonClassElement',
  [ts.SyntaxKind.Block]: 'Block',
  [ts.SyntaxKind.EmptyStatement]: 'EmptyStatement',
  [ts.SyntaxKind.VariableStatement]: 'VariableStatement',
  [ts.SyntaxKind.ExpressionStatement]: 'ExpressionStatement',
  [ts.SyntaxKind.IfStatement]: 'IfStatement',
  [ts.SyntaxKind.DoStatement]: 'DoStatement',
  [ts.SyntaxKind.WhileStatement]: 'WhileStatement',
  [ts.SyntaxKind.ForStatement]: 'ForStatement',
  [ts.SyntaxKind.ForInStatement]: 'ForInStatement',
  [ts.SyntaxKind.ForOfStatement]: 'ForOfStatement',
  [ts.SyntaxKind.ContinueStatement]: 'ContinueStatement',
  [ts.SyntaxKind.BreakStatement]: 'BreakStatement',
  [ts.SyntaxKind.ReturnStatement]: 'ReturnStatement',
  [ts.SyntaxKind.WithStatement]: 'WithStatement',
  [ts.SyntaxKind.SwitchStatement]: 'SwitchStatement',
  [ts.SyntaxKind.LabeledStatement]: 'LabeledStatement',
  [ts.SyntaxKind.ThrowStatement]: 'ThrowStatement',
  [ts.SyntaxKind.TryStatement]: 'TryStatement',
  [ts.SyntaxKind.DebuggerStatement]: 'DebuggerStatement',
  [ts.SyntaxKind.VariableDeclaration]: 'VariableDeclaration',
  [ts.SyntaxKind.VariableDeclarationList]: 'VariableDeclarationList',
  [ts.SyntaxKind.FunctionDeclaration]: 'FunctionDeclaration',
  [ts.SyntaxKind.ClassDeclaration]: 'ClassDeclaration',
  [ts.SyntaxKind.InterfaceDeclaration]: 'InterfaceDeclaration',
  [ts.SyntaxKind.TypeAliasDeclaration]: 'TypeAliasDeclaration',
  [ts.SyntaxKind.EnumDeclaration]: 'EnumDeclaration',
  [ts.SyntaxKind.ModuleDeclaration]: 'ModuleDeclaration',
  [ts.SyntaxKind.ModuleBlock]: 'ModuleBlock',
  [ts.SyntaxKind.CaseBlock]: 'CaseBlock',
  [ts.SyntaxKind.NamespaceExportDeclaration]: 'NamespaceExportDeclaration',
  [ts.SyntaxKind.ImportEqualsDeclaration]: 'ImportEqualsDeclaration',
  [ts.SyntaxKind.ImportDeclaration]: 'ImportDeclaration',
  [ts.SyntaxKind.ImportClause]: 'ImportClause',
  [ts.SyntaxKind.NamespaceImport]: 'NamespaceImport',
  [ts.SyntaxKind.NamedImports]: 'NamedImports',
  [ts.SyntaxKind.ImportSpecifier]: 'ImportSpecifier',
  [ts.SyntaxKind.ExportAssignment]: 'ExportAssignment',
  [ts.SyntaxKind.ExportDeclaration]: 'ExportDeclaration',
  [ts.SyntaxKind.NamedExports]: 'NamedExports',
  [ts.SyntaxKind.NamespaceExport]: 'NamespaceExport',
  [ts.SyntaxKind.ExportSpecifier]: 'ExportSpecifier',
  [ts.SyntaxKind.MissingDeclaration]: 'MissingDeclaration',
  [ts.SyntaxKind.ExternalModuleReference]: 'ExternalModuleReference',
  [ts.SyntaxKind.JsxElement]: 'JsxElement',
  [ts.SyntaxKind.JsxSelfClosingElement]: 'JsxSelfClosingElement',
  [ts.SyntaxKind.JsxOpeningElement]: 'JsxOpeningElement',
  [ts.SyntaxKind.JsxClosingElement]: 'JsxClosingElement',
  [ts.SyntaxKind.JsxFragment]: 'JsxFragment',
  [ts.SyntaxKind.JsxOpeningFragment]: 'JsxOpeningFragment',
  [ts.SyntaxKind.JsxClosingFragment]: 'JsxClosingFragment',
  [ts.SyntaxKind.JsxAttribute]: 'JsxAttribute',
  [ts.SyntaxKind.JsxAttributes]: 'JsxAttributes',
  [ts.SyntaxKind.JsxSpreadAttribute]: 'JsxSpreadAttribute',
  [ts.SyntaxKind.JsxExpression]: 'JsxExpression',
  [ts.SyntaxKind.JsxNamespacedName]: 'JsxNamespacedName',
  [ts.SyntaxKind.CaseClause]: 'CaseClause',
  [ts.SyntaxKind.DefaultClause]: 'DefaultClause',
  [ts.SyntaxKind.HeritageClause]: 'HeritageClause',
  [ts.SyntaxKind.CatchClause]: 'CatchClause',
  [ts.SyntaxKind.ImportAttributes]: 'ImportAttributes',
  [ts.SyntaxKind.ImportAttribute]: 'ImportAttribute',
  [ts.SyntaxKind.PropertyAssignment]: 'PropertyAssignment',
  [ts.SyntaxKind.ShorthandPropertyAssignment]: 'ShorthandPropertyAssignment',
  [ts.SyntaxKind.SpreadAssignment]: 'SpreadAssignment',
  [ts.SyntaxKind.EnumMember]: 'EnumMember',
  [ts.SyntaxKind.SourceFile]: 'SourceFile',
  [ts.SyntaxKind.Bundle]: 'Bundle',
  [ts.SyntaxKind.JSDocTypeExpression]: 'JSDocTypeExpression',
  [ts.SyntaxKind.JSDocNameReference]: 'JSDocNameReference',
  [ts.SyntaxKind.JSDocMemberName]: 'JSDocMemberName',
  [ts.SyntaxKind.JSDocAllType]: 'JSDocAllType',
  [ts.SyntaxKind.JSDocUnknownType]: 'JSDocUnknownType',
  [ts.SyntaxKind.JSDocNullableType]: 'JSDocNullableType',
  [ts.SyntaxKind.JSDocNonNullableType]: 'JSDocNonNullableType',
  [ts.SyntaxKind.JSDocOptionalType]: 'JSDocOptionalType',
  [ts.SyntaxKind.JSDocFunctionType]: 'JSDocFunctionType',
  [ts.SyntaxKind.JSDocVariadicType]: 'JSDocVariadicType',
  [ts.SyntaxKind.JSDocNamepathType]: 'JSDocNamepathType',
  [ts.SyntaxKind.JSDoc]: 'JSDoc',
  [ts.SyntaxKind.JSDocText]: 'JSDocText',
  [ts.SyntaxKind.JSDocTypeLiteral]: 'JSDocTypeLiteral',
  [ts.SyntaxKind.JSDocSignature]: 'JSDocSignature',
  [ts.SyntaxKind.JSDocLink]: 'JSDocLink',
  [ts.SyntaxKind.JSDocLinkCode]: 'JSDocLinkCode',
  [ts.SyntaxKind.JSDocLinkPlain]: 'JSDocLinkPlain',
  [ts.SyntaxKind.JSDocTag]: 'JSDocTag',
  [ts.SyntaxKind.JSDocAugmentsTag]: 'JSDocAugmentsTag',
  [ts.SyntaxKind.JSDocImplementsTag]: 'JSDocImplementsTag',
  [ts.SyntaxKind.JSDocAuthorTag]: 'JSDocAuthorTag',
  [ts.SyntaxKind.JSDocDeprecatedTag]: 'JSDocDeprecatedTag',
  [ts.SyntaxKind.JSDocClassTag]: 'JSDocClassTag',
  [ts.SyntaxKind.JSDocPublicTag]: 'JSDocPublicTag',
  [ts.SyntaxKind.JSDocPrivateTag]: 'JSDocPrivateTag',
  [ts.SyntaxKind.JSDocProtectedTag]: 'JSDocProtectedTag',
  [ts.SyntaxKind.JSDocReadonlyTag]: 'JSDocReadonlyTag',
  [ts.SyntaxKind.JSDocOverrideTag]: 'JSDocOverrideTag',
  [ts.SyntaxKind.JSDocCallbackTag]: 'JSDocCallbackTag',
  [ts.SyntaxKind.JSDocOverloadTag]: 'JSDocOverloadTag',
  [ts.SyntaxKind.JSDocEnumTag]: 'JSDocEnumTag',
  [ts.SyntaxKind.JSDocParameterTag]: 'JSDocParameterTag',
  [ts.SyntaxKind.JSDocReturnTag]: 'JSDocReturnTag',
  [ts.SyntaxKind.JSDocThisTag]: 'JSDocThisTag',
  [ts.SyntaxKind.JSDocTypeTag]: 'JSDocTypeTag',
  [ts.SyntaxKind.JSDocTemplateTag]: 'JSDocTemplateTag',
  [ts.SyntaxKind.JSDocTypedefTag]: 'JSDocTypedefTag',
  [ts.SyntaxKind.JSDocSeeTag]: 'JSDocSeeTag',
  [ts.SyntaxKind.JSDocPropertyTag]: 'JSDocPropertyTag',
  [ts.SyntaxKind.JSDocThrowsTag]: 'JSDocThrowsTag',
  [ts.SyntaxKind.JSDocSatisfiesTag]: 'JSDocSatisfiesTag',
  [ts.SyntaxKind.SyntaxList]: 'SyntaxList',
  [ts.SyntaxKind.NotEmittedStatement]: 'NotEmittedStatement',
  [ts.SyntaxKind.PartiallyEmittedExpression]: 'PartiallyEmittedExpression',
  [ts.SyntaxKind.CommaListExpression]: 'CommaListExpression',
  [ts.SyntaxKind.SyntheticReferenceExpression]: 'SyntheticReferenceExpression',
  [ts.SyntaxKind.Count]: 'Count',
} as const

const namesRecord = SyntaxKindName as Record<ts.SyntaxKind, string | undefined>

export const getNodeName = (node: ts.Node): string => {
  return namesRecord[node.kind] ?? 'Unknown'
}

export const getSyntaxName = (kind: ts.SyntaxKind): string => {
  return namesRecord[kind] ?? 'Unknown'
}

export type SyntaxKindNameType = typeof SyntaxKindName

export type ModuleStatements = ts.ClassDeclaration | ts.ImportDeclaration | ts.VariableStatement | ts.FunctionDeclaration

export type PrimaryExpressions =
  | LiteralExpressions
  | ts.TrueLiteral
  | ts.FalseLiteral
  | ts.ArrayLiteralExpression
  | ts.ClassExpression
  | ts.FunctionExpression
  | ts.Identifier
  | ts.ImportExpression
  | ts.NewExpression
  | ts.NullLiteral
  | ts.ObjectLiteralExpression
  | ts.PrivateIdentifier
  | ts.ParenthesizedExpression
  | ts.SuperExpression
  | ts.TemplateExpression
  | ts.ThisExpression

export type MemberExpressions =
  | PrimaryExpressions
  | ts.ElementAccessExpression
  | ts.ExpressionWithTypeArguments
  | ts.PropertyAccessExpression
  | ts.TaggedTemplateExpression

export type LeftHandSideExpression = ts.CallExpression | MemberExpressions | ts.NonNullExpression

/**
 * All concrete types which extends ts.ClassElement
 */
export type ClassElements =
  | ts.ClassStaticBlockDeclaration
  | ts.ConstructorDeclaration
  | ts.GetAccessorDeclaration
  | ts.IndexSignatureDeclaration
  | ts.MethodDeclaration
  | ts.PropertyDeclaration
  | ts.SemicolonClassElement
  | ts.SetAccessorDeclaration

/**
 * All concrete types which extends ts.Statement
 */
export type Statements =
  | ts.EmptyStatement
  | ts.VariableStatement
  | ts.ExpressionStatement
  | ts.IfStatement
  | ts.DoStatement
  | ts.WhileStatement
  | ts.ForStatement
  | ts.ForInStatement
  | ts.ForOfStatement
  | ts.ContinueStatement
  | ts.BreakStatement
  | ts.ReturnStatement
  | ts.WithStatement
  | ts.SwitchStatement
  | ts.LabeledStatement
  | ts.ThrowStatement
  | ts.TryStatement
  | ts.DebuggerStatement
  | ts.ImportDeclaration
  | ts.ClassDeclaration
  | ts.TypeAliasDeclaration

/**
 * All concrete types which extends ts.LiteralExpression
 */
export type LiteralExpressions =
  | ts.NumericLiteral
  | ts.BigIntLiteral
  | ts.StringLiteral
  | ts.RegularExpressionLiteral
  | ts.NoSubstitutionTemplateLiteral

/**
 * All concrete types which extend ts.Expression
 */
export type Expressions =
  | ts.PropertyAccessExpression
  | ts.ElementAccessExpression
  | ts.TypeAssertion
  | ts.ParenthesizedExpression
  | ts.FunctionExpression
  | ts.DeleteExpression
  | ts.TypeOfExpression
  | ts.VoidExpression
  | ts.AwaitExpression
  | ts.PrefixUnaryExpression
  | ts.PostfixUnaryExpression
  | ts.BinaryExpression
  | ts.ConditionalExpression
  | ts.TemplateExpression
  | ts.YieldExpression
  | ts.OmittedExpression
  | ts.ExpressionWithTypeArguments
  | ts.AsExpression
  | ts.NonNullExpression
  | ts.SyntheticExpression
  | ts.SatisfiesExpression
  | PrimaryExpressions
  | LeftHandSideExpression

/**
 * Map an inherited base type to a union type of "all" the nodes which extend that base type
 * where "all" is limited to nodes relevant to this compiler.
 */
export type MapBaseType<T> = IfEquals<
  T,
  ts.Expression,
  Expressions,
  IfEquals<
    T,
    ts.LeftHandSideExpression,
    LeftHandSideExpression,
    IfEquals<T, ts.Statement, Statements, IfEquals<T, ts.ClassElement, ClassElements, T>>
  >
>

type IfEquals<T, U, Y = unknown, N = never> = ((x: T) => T) extends (x: U) => U ? (((x: U) => U) extends (x: T) => T ? Y : N) : N

export const BinaryOpSyntaxes = {
  [ts.SyntaxKind.PlusToken]: BuilderBinaryOp.add,
  [ts.SyntaxKind.MinusToken]: BuilderBinaryOp.sub,
  [ts.SyntaxKind.AsteriskToken]: BuilderBinaryOp.mult,
  [ts.SyntaxKind.SlashToken]: BuilderBinaryOp.div,
  [ts.SyntaxKind.PercentToken]: BuilderBinaryOp.mod,
  [ts.SyntaxKind.AsteriskAsteriskToken]: BuilderBinaryOp.pow,
  [ts.SyntaxKind.BarToken]: BuilderBinaryOp.bitOr,
  [ts.SyntaxKind.CaretToken]: BuilderBinaryOp.bitXor,
  [ts.SyntaxKind.AmpersandToken]: BuilderBinaryOp.bitAnd,
  [ts.SyntaxKind.LessThanLessThanToken]: BuilderBinaryOp.lshift,
  [ts.SyntaxKind.GreaterThanGreaterThanToken]: BuilderBinaryOp.rshift,
} as const

export function isKeyOf<TMap extends object>(key: PropertyKey, map: TMap): key is keyof TMap {
  return Object.hasOwn(map, key)
}

export const ComparisonOpSyntaxes = {
  [ts.SyntaxKind.EqualsEqualsEqualsToken]: BuilderComparisonOp.eq,
  [ts.SyntaxKind.ExclamationEqualsEqualsToken]: BuilderComparisonOp.ne,
  [ts.SyntaxKind.LessThanToken]: BuilderComparisonOp.lt,
  [ts.SyntaxKind.LessThanEqualsToken]: BuilderComparisonOp.lte,
  [ts.SyntaxKind.GreaterThanToken]: BuilderComparisonOp.gt,
  [ts.SyntaxKind.GreaterThanEqualsToken]: BuilderComparisonOp.gte,
} as const

export const AugmentedAssignmentBinaryOp = {
  [ts.SyntaxKind.PlusEqualsToken]: BuilderBinaryOp.add,
  [ts.SyntaxKind.MinusEqualsToken]: BuilderBinaryOp.sub,
  [ts.SyntaxKind.AsteriskEqualsToken]: BuilderBinaryOp.mult,
  [ts.SyntaxKind.SlashEqualsToken]: BuilderBinaryOp.div,
  [ts.SyntaxKind.PercentEqualsToken]: BuilderBinaryOp.mod,
  [ts.SyntaxKind.AsteriskAsteriskEqualsToken]: BuilderBinaryOp.pow,
  [ts.SyntaxKind.BarEqualsToken]: BuilderBinaryOp.bitOr,
  [ts.SyntaxKind.CaretEqualsToken]: BuilderBinaryOp.bitXor,
  [ts.SyntaxKind.AmpersandEqualsToken]: BuilderBinaryOp.bitAnd,
  [ts.SyntaxKind.LessThanLessThanEqualsToken]: BuilderBinaryOp.lshift,
  [ts.SyntaxKind.GreaterThanGreaterThanEqualsToken]: BuilderBinaryOp.rshift,
} as const

export const UnaryExpressionUnaryOps = {
  [ts.SyntaxKind.PlusPlusToken]: BuilderUnaryOp.inc,
  [ts.SyntaxKind.MinusMinusToken]: BuilderUnaryOp.dec,
  [ts.SyntaxKind.PlusToken]: BuilderUnaryOp.pos,
  [ts.SyntaxKind.MinusToken]: BuilderUnaryOp.neg,
  [ts.SyntaxKind.TildeToken]: BuilderUnaryOp.bit_inv,
  [ts.SyntaxKind.ExclamationToken]: BuilderUnaryOp.log_not,
}

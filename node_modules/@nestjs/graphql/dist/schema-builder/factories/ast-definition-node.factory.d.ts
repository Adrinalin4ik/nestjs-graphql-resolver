import { FieldDefinitionNode, GraphQLInputType, GraphQLOutputType, InputObjectTypeDefinitionNode, InputValueDefinitionNode, InterfaceTypeDefinitionNode, ObjectTypeDefinitionNode } from 'graphql';
import { DirectiveMetadata } from '../metadata/directive.metadata';
export declare class AstDefinitionNodeFactory {
    createObjectTypeNode(name: string, directiveMetadata?: DirectiveMetadata[]): ObjectTypeDefinitionNode | undefined;
    createInputObjectTypeNode(name: string, directiveMetadata?: DirectiveMetadata[]): InputObjectTypeDefinitionNode | undefined;
    createInterfaceTypeNode(name: string, directiveMetadata?: DirectiveMetadata[]): InterfaceTypeDefinitionNode | undefined;
    createFieldNode(name: string, type: GraphQLOutputType, directiveMetadata?: DirectiveMetadata[]): FieldDefinitionNode | undefined;
    createInputValueNode(name: string, type: GraphQLInputType, directiveMetadata?: DirectiveMetadata[]): InputValueDefinitionNode | undefined;
    private createDirectiveNode;
}

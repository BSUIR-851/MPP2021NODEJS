const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const GraphQLDateTime = require('graphql-type-datetime');

const taskService = require('./task.js');

const schema = buildSchema(`
	scalar DateTime
	type Task {
		_id: ID!,
		files: [String]!,
		user: ID!,
		description: String!,
		expireDate: String!,
	}

	type Query {
		task(id: ID!): Task!
		tasks: [Task]!
		active: [Task]!
		completed: [Task]!
	}

	type Mutation {
		completeTask(id: ID!): Task!
		createTask(description: String!, expireDate: String!, files: [String]!): Task!
		deleteTask(id: ID!): String!
		updateTask(description: String!, expireDate: String!, files: [String]!): Task!
	}
`);

const rootResolver = {
	DateTime: GraphQLDateTime,
	task: taskService.getById,
	tasks: taskService.getAll,
	active: taskService.getAllActive,
	completed: taskService.getAllCompleted,
	completeTask: taskService.complete,
	createTask: taskService.create,
	deleteTask: taskService.remove,
	updateTask: taskService.update,
};

const graphql = graphqlHTTP((req, res) => ({
	schema,
	rootValue: rootResolver,
	graphiql: true,
	context: {
		req: req,
		res: res,
	},
}));

module.exports = graphql;

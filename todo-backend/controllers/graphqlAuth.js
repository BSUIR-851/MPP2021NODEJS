const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const GraphQLDateTime = require('graphql-type-datetime');

const authService = require('./auth.js');

const schema = buildSchema(`
	type User {
		_id: ID!,
		email: String!,
		password: String!,
	}

	type Mutation {
		login(email: String!, password: String!): String!
		register(email: String!, password: String!): User!
	}
`);

const rootResolver = {
	login: authService.login,
	tasks: authService.register,
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

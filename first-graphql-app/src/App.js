const axios = require('axios') 
const { GraphQLServer } = require('graphql-yoga');

var todosList = [];
var usersList = [];

const resolvers = {
    Query: {
        users: async () => getRestUsersList(),
        todos: async () => getRestTodoList(),
        todo: (parent, args, context, info) => todoById(parent, args, context, info),
        user: (parent, args, context, info) => userById(parent, args, context, info), 
    },
    User:{
        todos: (parent, args, context, info) => {
            return todosList.filter(t => t.user_id == parent.id);
        }
    },
    ToDoItem:{
        user: (parent, args, context, info) => { 
            return usersList.find(u => u.id == parent.user_id);
        }
    },
} 

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`));

async function todoById(parent, args, context, info){
    const todo = await axios.get("https://jsonplaceholder.typicode.com/todos")

    todosList =
        todo.data.map(({ id, title, completed, user_id }) => ({
            id: id,
            title: title,
            completed: completed,
            user_id: user_id,
        }))

    return todosList.find(t => t.id == args.id);
}

async function userById(parent, args, context, info){
    const users = await axios.get("https://jsonplaceholder.typicode.com/users")

    usersList = 
        users.data.map(({id, name, email, username }) => ({
            id: id,
            name: name,
            email: email,
            login: username,
        }))
    ;

    return usersList.find(u => u.id == args.id);
}      


async function getRestUsersList(){
    try {
        const users = await axios.get("https://jsonplaceholder.typicode.com/users")

        return users.data.map(({ id, name, email, username }) => ({
            id: id,
            name: name,
            email: email,
            login: username,
    }))
    } catch (error) {
        //throw error
        console.log(error);  
    }
}  
  
async function getRestTodoList(){
    try {
        const todo = await axios.get("https://jsonplaceholder.typicode.com/todos")

        return todo.data.map(({ id, title, completed, user_id }) => ({
            id: id,
            title: title,
            completed: completed,
            user_id: user_id,
            
    }))
    } catch (error) {
        //throw error
        console.log(error);
    }
}

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync("./todo.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const todoService = protoDescriptor.TodoService;

const server = new grpc.Server();

const todos = [
  {
    id: "1",
    title: "Todo 1",
    content: "Content of Todo 1",
  },
  {
    id: "2",
    title: "Todo 2",
    content: "Content of Todo 2",
  },
  {
    id: "3",
    title: "Todo 3",
    content: "Content of Todo 3",
  },
];

server.addService(todoService.service, {
  ListTodos: (call, callback) => {
    callback(null, {
      todos: todos,
    });
  },

  CreateTodo: (call, callback) => {
    let newTodo = call.request;
    todos.push(newTodo);
    callback(null, newTodo);
  },

  GetTodo: (call, callback) => {
    let todoId = call.request.todoId;
    const response = todos.filter((todo) => todo.id == todoId);
    if (response.length > 0) {
      callback(null, response);
    } else {
      callback(
        {
          message: "Todo Not Found",
        },
        null
      );
    }
  },
});

server.bindAsync(
  "127.0.0.1:50501",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Server Started");
  }
);

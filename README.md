# Nest-Boilerplate-Slim

## Description

A slim nest js boilerplate. I had previously made a boilerplate for NestJS projects, but it was outdated and had a bit too much in it for what I want in projects going forward. Note that there's not a lot of custom code here. Most of what I've put in is straight from the [Nest docs](https://docs.nestjs.com/). I've also taken some ideas/code from two other great boilerplates:

- [awesome-nest-boilerplate](https://github.com/NarHakobyan/awesome-nest-boilerplate)
- [nestjs-boilerplate](https://github.com/Vivify-Ideas/nestjs-boilerplate/blob/master/package.json)

The general features included in this boilerplate are:

- Environment based configuration
- Logging
- TypeORM integration
- JWT authentication
- CRUD auto generating controllers/services
- User module including login/register/reset password routes
- Request-specific session context
- General security hardening
- Tests
- Roles/permissions
- Emailing
- OpenAPI (Swagger) documentation
- Auto-generating code documentation

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run dev

# production mode
$ npm run start:prod

# Serve compodoc code documentation
$ npm run docs

# Generate a migration automatically from typeorm
$ npm run migration:generate -- <name_of_migration>

# Create a migration to be manually filled out
$ npm run migration:create -- <name_of_migration>
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Features

### Environment based configuration

https://docs.nestjs.com/techniques/configuration

### Logging

We use a combination of built in Nest logging, winston, and morgan for logging in this boilerplate.

For the HTTP requests we are using [morgan](https://github.com/expressjs/morgan). This gets registered as middleware in the `AppModule` for all routes:

```ts
consumer
  .apply(
    morgan('combined', {
      stream: {
        write: str => this.morganLogger.verbose(str.replace(/\n/g, '')),
      },
    }),
  )
  .forRoutes('*');
```

For all other logging, classes are expected to instantiate their own logger like this:

```ts
private logger = new Logger(AuthService.name);
```

This allows us to provide a name for context to more easily see where the log messages are coming from in the way that the standard Nest logger does. The `Logger` extends Nest's own logger which calls the Nest Logger on each message so we don't have to use a winston transport for console.

In production, an additional transport is added for JSON newline separated log entries which can be used in popular logging services such as [Logstash](https://www.elastic.co/logstash).

### TypeORM Configuration

https://docs.nestjs.com/techniques/database

Utilizes a `ormconfig.js` file for the ORM configuration. Migrations are run by default on every start. Make sure to utilize the command for automatically generating migrations when you make changes to the database since TypeORM does a great job in keeping that all in sync.

### JWT Authentication

https://docs.nestjs.com/techniques/authentication

Here's a small breakdown of what happens for the process of logging in:

- We utilize the `/auth/login` route for logging a user in
- That route is protected by the `LocalAuthGuard` which is just using the `AuthGuard` from `@nestjs/passport`.
- That guard automatically utilizes the `LocalStrategy` we've defined and calls the `validate` method on it.
- This strategy goes through the process of looking up the user and verifying the password
- If all that goes well, the `login` method of `AuthService` is called which generates the JWT to be returned to the user.

For auth protected routes that need a valid JWT:

- We decorate the routes with `UseGuards(JwtAuthGuard)`
- This guard utilizes the `AuthGuard` from passport for checking a valid JWT
- This time the `JwtStrategy` is used for authenticating the request.
- The `validate` method there tries to find the user from the JWT in our database and returns the valid user if one is found.
- The user object that's returned from the `validate` method sets `req.user` behind the scenes to be used by other parts of the request

### CRUD auto generating controllers/services

https://github.com/nestjsx/crud

### User module

We've setup some basic routes here for a user to login, register, and handle a password reset.

### Session context

For each individual request we setup a session context where we can store various values. This comes is particularly handy for logging since we can store a unique request ID as well as the current user to append that data to _every_ logging call. This allows us to trace all the log messages for a single request or look at messages pertaining to a single user.

The unique request ID gets set on the `SessionMiddleware` who's `use` method gets called on every request. The user gets set on the `AuthUserInterceptor` which is registered as a global interceptor in `main.ts`.

### Security hardening

https://docs.nestjs.com/techniques/authentication

### Tests

### Roles/permissions

I went back and forth on using a full-blown access control library like [casl](https://github.com/stalniy/casl), but I ended up going with a simple role and permission based system for the boilerplate. Role and permission based decorators and guards are provided to ensure that the user has a particular role or permission to access the controller.

We use these type of guards using the routes customization that `@nestjsx/crud` gives us:

```ts
getOneBase: {
  decorators: [
    UseGuards(JwtAuthGuard, PermissionsGuard),
    Permissions(Permission.READ_USER),
  ],
},
```

In order to add more permissions or roles, add new values to the `permissions.ts` and `roles.ts` enums.

### Emailing

We have a basic emailing setup using Gmail credentials or a test account in development. The main idea here is that we have template strings for the various emails that we want to send out which can be provided parameters to be used in the email body.

In a real application, this can be expanded to insert the resulting string from the email templates into a larger email template that has some nice styling.

In development a link will be printed on sending an email to view what it would have looked like.

### OpenAPI documentation

`@nestjsx/crud` takes care of giving us some great OpenAPI documentation right out of the box. If you want to customize this documentation you can customize the decorators on the routes like this:

```ts
routes: {
  createOneBase: {
    decorators: [
      ApiOperation({
        description: 'Register a new user',
      }),
    ],
  },
}
```

### Auto-generating code documentation

https://docs.nestjs.com/recipes/documentation

# TODO API Documentation

## Description
An Express based API for a Task Manager where you can retrieve, create, update and delete tasks.

## How to start the server

Clone this repository:

```bash
git clone https://github.com/Maycas/TODO-App.git
```

Once cloned, install dependencies:

```bash
npm install
```

To start the server, run:

```bash
npm start
```

To start the server in development mode, run:

```bash
npm run dev
```

## Base URL
All URLs below are relative to the following base URL:

```
http://localhost:5001/
```

## API endpoints

### Retrieve All Tasks

Returns all tasks, or a subset when applying filters.

```
GET /tasks
```

#### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| datemin | String | False | Filters tasks that are due after this date | 2023/04/20 18:30:00 |
| datemax | String | False | Filters tasks that are due before this date | 2023/12/31 03:40:00 |
| search | String |  False | Filters tasks that contain the search string in its title | "Prepare", "upload" |
| status | String | False | Filters tasks that have a specific status | ("COMPLETED", "IN PROGRESS", "PENDING", "POSTPONED", "DELETED") |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| id | String | Task unique identifier |
| title | String | Task title |
| dueDate | String | Task due date |
| status | String | Task status |
| createdAt | String | Task creation date |
| modifiedAt | String | Task last modification date |
| deletedAt | String | Task deletion date |

#### Error responses

##### 404 - Task not Found

```json
{ msg: "No tasks were found" }
```

#### Example

**Request**

```
/tasks?datemax=2023/12/25%2012:07:23&status=PENDING
```

**Response**

```json
[
  {
    "id": "1cc0282f-97fc-41aa-a9e3-3e295d824cdc",
    "title": "Prepare luggage",
    "dueDate": "2023/07/20 11:54:30",
    "status": "PENDING",
    "createdAt": "2023/04/15 18:30:00",
    "modifiedAt": undefined,
    "deletedAt": undefined
  },
  {
    "id": "a3cbd0a5-425a-40a5-9e82-e67eaf54c050",
    "title": "Buy flights",
    "dueDate": "2023/12/31 03:40:00",
    "status": "PENDING",
    "createdAt": "2023/04/15 03:28:34",
    "modifiedAt": undefined,
    "deletedAt": undefined
  }
]
```

### Retrieve a Task by ID

Returns a single task that matches the provided task id.

```
GET /tasks/:id
```

#### URL Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| id | String | True | Task identifier | 1cc0282f-97fc-41aa-a9e3-3e295d824cdc |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| id | String | Task unique identifier |
| title | String | Task title |
| dueDate | String | Task due date |
| status | String | Task status |
| createdAt | String | Task creation date |
| modifiedAt | String | Task last modification date |
| deletedAt | String | Task deletion date |

#### Error responses

##### 404 - Task not Found

```json
{ msg: "Task not found" }
```

#### Example

**Request**

```
GET /tasks/a3cbd0a5-425a-40a5-9e82-e67eaf54c050
```

**Response**

```json
{
    "id": "a3cbd0a5-425a-40a5-9e82-e67eaf54c050",
    "title": "Buy flights",
    "dueDate": "2023/12/31 03:40:00",
    "status": "PENDING",
    "createdAt": "2023/04/15 03:28:34",
    "modifiedAt": "2023/04/15 03:30:34",
    "deletedAt": undefined
}
```

### Create a Task

Creates a new task with the given data in the request body.

```
POST /tasks
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | True | Task title |
| dueDate | String | True | Task due date |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| id | String | Task unique identifier |
| title | String | Task title |
| dueDate | String | Task due date |
| status | String | Task status |
| createdAt | String | Task creation date |

#### Error responses

##### 400 - Duplicated Task

```json
{ msg: "Task already exists" }
```

#### Example

**Request**

```
POST /tasks

{
    "title": "Prepare luggage",
    "dueDate": "2023/07/20 11:54:30"
}
```

**Response**

```json
{
    "id": "1cc0282f-97fc-41aa-a9e3-3e295d824cdc",
    "title": "Prepare luggage",
    "dueDate": "2023/07/20 11:54:30",
    "status": "PENDING",
    "createdAt": "2023/04/26 12:30:00",
    "deletedAt": undefined
}
```

### Delete a Task

Deletes a task by its id, applying a soft delete mechanism, which means that the task stays in the database but in a DELETED status.

```
DELETE /tasks/:id
```

#### URL Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| id | String | True | Unique identifier of the task to delete | 1cc0282f-97fc-41aa-a9e3-3e295d824cdc |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| msg | String | Error response message |

#### Error responses

##### 404 - Task not Found

```json
{ msg: "Task with id 1cc0282f-97fc-41aa-a9e3-3e295d824cdc doesn't exist" }
```

#### Example

**Request**

```
DELETE /tasks/1cc0282f-97fc-41aa-a9e3-3e295d824cdc
```

**Response**

```json
{ "msg": "Task successfully deleted" }
```

### Update a Task

Updates a task by its ID.

```
PUT /tasks/:id
```

#### URL Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| id | String | True | Unique identifier of the task to update | 1cc0282f-97fc-41aa-a9e3-3e295d824cdc |

#### Request Body

The request body must be a JSON object containing one or more of the following fields:

| Field | Type | Required | Description |
|-------|------|-------------|----------|
| title | String | False | Title of the task |
| dueDate | String | False | Due date of the task in the format YYYY-MM-DD |
| status | String | False | Status of the task |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier of the updated task |
| title | String | Title of the updated task |
| dueDate | String | Due date of the updated task in the format YYYY-MM-DD |
| status | String | Status of the updated task (PENDING, COMPLETED, DELETED) |
| createdAt | String | Creation date of the task in the format YYYY-MM-DDTHH:mm:ss.sssZ |
| modifiedAt | String | Modification date of the task in the format YYYY-MM-DDTHH:mm:ss.sssZ |
| deletedAt | String | Deletion date of the task in the format YYYY-MM-DDTHH:mm:ss.sssZ if the task was soft-deleted or null otherwise |

#### Error responses

##### 404 - Task not Found

```json
{ msg: "Task with id 1cc0282f-97fc-41aa-a9e3-3e295d824cdc doesn't exist" }
```

#### Example

**Request**

```
PUT /tasks/1cc0282f-97fc-41aa-a9e3-3e295d824cdc

{
    "title": "Updated task title",
    "dueDate": "2023-05-01 11:32:08",
    "status": "COMPLETED"
}
```

**Response**

```json
{
    "id": "1cc0282f-97fc-41aa-a9e3-3e295d824cdc",
    "title": "Updated task title",
    "dueDate": "2023-05-01 11:32:08",
    "status": "COMPLETED",
    "createdAt": "2023/04/26 12:30:00",
    "modifiedAt": "2023/04/26 15:19:00",
}
```





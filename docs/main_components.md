# MAIN COMPONENTS 🤩

Our backend-structure is inspired by the principles of the Model-View-Controller (MVC) pattern, but it's adapted to a more modern context.

The components talk to each other in a tree-structure kind of way. A `controller` always calls to a `flow-service`, which in its turn calls to `service(s)`. A `controller` will ***NEVER*** call on another `controller`, a `flow-service` will ***NEVER*** call on another `flow-service`, and so forth.

## [CONTROLLER](main_components/controller.md) ⚙️

- **Purpose:** Handle HTTP requests and responses.
- **Role:** It processes incoming requests, executes application logic by calling its designated flow-service function, and returns the appropriate response (e.g., JSON data, file buffer).

## [FLOW SERVICE](main_components/flow_service.md) 👮🏼‍♀️

- **Purpose:** Orchestrate and manage complex workflows involving multiple service interactions.
- **Role:** It handles the coordination and sequencing of various service calls, ensuring that each step in the workflow is executed correctly and in the proper order. The Flow Service can also handle rollback logic if necessary, providing a higher-level abstraction over individual services.

## [SERVICE](main_components/service.md) ✨

- **Purpose:** Encapsulate business logic and data manipulation.
- **Role:** It performs the core functions of your application, often interacting with repositories to fetch or save data.

## [REPOSITORY](main_components/repository.md) 💽

- **Purpose:** Abstract data access logic and manage database operations.
- **Role:** It provides an interface for querying, saving, updating, and deleting data from the database.

---

###### [GO BACK TO README](../README.md)

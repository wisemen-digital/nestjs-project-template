# CONTROLLER

## SUMMARY

The controller is responsible for connecting ur flow-services to the world wide web.

## RESPONSIBILITIES

- Authentication
- API documentation
- Transformers
- Paginated responses

## COMPONENTS

### DOCS

For each route we provide an `ApiResponse` object to further facilitate our FrontEnd team with understanding the responses our BackEnd gives them. We gather these `consts` in a separate file (`/component/docs/component-response.docs.ts`) as to avoid cluttering up our controller. The `type` used will always match that of the [transformer](#TRANSFORMER) used for the response.

example:

```typescript
import { type ApiResponseOptions } from '@nestjs/swagger'

export const createComponentApiResponse: ApiResponseOptions = {
	status: 201,
	description: 'Successfully created component',
	type: CreateComponentResponse
}
```

### DTO

These are the values that we expect to receive from the FrontEnd. We use decorators from the [class-validator](https://github.com/typestack/class-validator) package (or we write our own) to validate the incoming data. Decorators to document its properties (as seen in [transformer](#TRANSFORMER)) is also desired.

```typescript
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateComponentDto {
	@ApiProperty({ type: 'string' })
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }) => value.toLowerCase())
	name: string
}
```

### TRANSFORMER

The transformers is responsible for transforming (it's literally in the name) the object(s) to a readable API-response, tailored to the FrontEnd-needs. We use our in-house-made `@appwise/transformer` package, this requires a `transform` function to be defined, which only takes care of a singular object. The package then exposes a `.item` and `.array` function accordingly.

example:

```typescript
import { Transformer } from '@appwise/transformer'
import { type ApiResponseOptions } from '@nestjs/swagger'

export class CreateComponentResponse {
	@ApiProperty({ type: 'string', format: 'uuid' })
	uuid: string
	
	@ApiProperty({ type: 'string', description: 'Name given by the backend' })
	name: string
}

export class CreateComponentResponseTransformer extends Transformer<File, CreateFileResponse> {
	transform (component: Component): CreateFileResponse {
		return {
			uuid: component.uuid,
			name: component.name,
		}
	}
}
```

---

###### [GO BACK TO MAIN COMPONENTS](../main_components.md)

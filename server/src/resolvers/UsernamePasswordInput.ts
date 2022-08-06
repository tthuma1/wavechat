import { InputType, Field } from "type-graphql";

@InputType()
export class UsernamePasswordInput {
  @Field({ nullable: true })
  email?: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

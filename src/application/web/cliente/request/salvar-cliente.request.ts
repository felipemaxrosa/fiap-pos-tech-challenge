import { ApiProperty } from "@nestjs/swagger";

export class SalvarClienteRequest {
    @ApiProperty({required: true, nullable: false, description: "Nome cliente"})
    public nome: string;
    @ApiProperty({required: true, nullable: false, description: "Email cliente"})
    public email: string;
    @ApiProperty({required: true, nullable: false, description: "CPF cliente"})
    public cpf: string;
}
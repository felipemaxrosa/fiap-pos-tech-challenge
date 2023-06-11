import { ApiProperty } from "@nestjs/swagger";

export class SalvarClienteRequest {
    @ApiProperty({required: true, nullable: false, description: "Nome cliente"})
    readonly nome: string;
    @ApiProperty({required: true, nullable: false, description: "Email cliente"})
    readonly email: string;
    @ApiProperty({required: true, nullable: false, description: "CPF cliente"})
    readonly cpf: string;

    static toString(request: SalvarClienteRequest): string{
        return JSON.stringify(request)
    }
}

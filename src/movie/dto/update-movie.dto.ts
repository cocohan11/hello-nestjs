import { Contains, Equals, IsAlphanumeric, IsArray, IsBoolean, IsCreditCard, IsDateString, IsDefined, IsDivisibleBy, IsEmpty, IsEnum, IsHexColor, IsIn, IsInt, IsLatLong, IsNegative, IsNotEmpty, IsNotIn, IsNumber, IsOptional, IsPositive, IsString, IsUUID, isValidationOptions, Max, MaxLength, Min, MinLength, NotContains, registerDecorator, Validate, ValidationArguments, ValidationOptions, Validator, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


enum MovieGenre {
    Fantasy = 'fantasy',
    Action = 'action'
}


export class UpdateMovieDto {

    @IsNotEmpty()  // 값이 제공될 경우 빈 문자열이나 null은 허용하지 않음
    @IsOptional()  // 런타임에 동작
    title?: string;  // 컴파일 타임에만 동작 // 개발 시에만 도움이 되고, 런타임에는 영향 없음

    @IsNotEmpty()  
    @IsOptional()  
    genre?: string;

    @IsNotEmpty()  
    @IsOptional()  
    detail?: string;
}

// 유효하지 않은 데이터
// { title: "" } // 에러 (빈 문자열)
// { genre: null } // 에러 (null)
// { title: "   " } // 에러 (공백만 있는 문자열)
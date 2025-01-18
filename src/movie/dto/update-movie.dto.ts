import { Contains, Equals, IsAlphanumeric, IsArray, IsBoolean, IsCreditCard, IsDateString, IsDefined, IsDivisibleBy, IsEmpty, IsEnum, IsHexColor, IsIn, IsInt, IsLatLong, IsNegative, IsNotEmpty, IsNotIn, IsNumber, IsOptional, IsPositive, IsString, IsUUID, isValidationOptions, Max, MaxLength, Min, MinLength, NotContains, registerDecorator, Validate, ValidationArguments, ValidationOptions, Validator, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


enum MovieGenre {
    Fantasy = 'fantasy',
    Action = 'action'
}


// 내가만든 validator
@ValidatorConstraint() 
class PasswordValidator implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        // 비밀번호 길이는 4-8
        return value.length > 4 && value.length < 8;
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        return '비밀번호 길이는 4~8자여야 합니다. 입력된 비밀번호 : ($value)'
    }
}


// 내가만든 validator
function IsPasswordValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({ // 데코레이터를 등록하겠다. 
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: PasswordValidator,
        }); 
    }
}


export class UpdateMovieDto {

    @IsNotEmpty()  // 값이 제공될 경우 빈 문자열이나 null은 허용하지 않음
    @IsOptional()  // 런타임에 동작
    title?: string;  // 컴파일 타임에만 동작 // 개발 시에만 도움이 되고, 런타임에는 영향 없음

    @IsNotEmpty()  
    @IsOptional()  
    genre?: string;

    //@IsDefined() // null || undefined
    //@IsOptional() 
    //@Equals('han')
    // @IsEmpty() // null || undefined || ''
    // @IsNotEmpty()  
    // @IsIn(['action', 'fantasy']) // Array // 일회성성
    // @IsNotIn(['action', 'fantasy'])
    // @IsBoolean()
    // @IsString()
    // @IsNumber()
    // @IsInt() // 정수
    // @IsArray()
    // @IsEnum(MovieGenre)
    // @IsDateString() // "2025-01-18T12:00"
    // @IsDivisibleBy(5) 
    // @IsPositive() // 양수
    // @IsNegative() // 음수
    // @Min(100) // 이상
    // @Max(200)
    // @Contains('han') // 포함
    // @NotContains('ㅗ')
    // @IsAlphanumeric() // 알파벳/숫자만
    // @IsCreditCard()
    // @IsHexColor()
    // @MaxLength(10)
    // @MinLength(4)
    // @IsUUID() // UUID타입인지
    // @IsLatLong()
    // @Validate(PasswordValidator, {
    //     message: '다른에러메시징'
    // })
    @IsPasswordValid()
    test: string;
}

// 유효하지 않은 데이터
// { title: "" } // 에러 (빈 문자열)
// { genre: null } // 에러 (null)
// { title: "   " } // 에러 (공백만 있는 문자열)
from marshmallow import Schema, fields, validates, ValidationError
from datetime import date

class RegisterSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True, validate=lambda s: len(s) >= 8)

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)

class TxSchema(Schema):
    id = fields.Int(dump_only=True)
    date = fields.Date(required=True)
    amount = fields.Decimal(as_string=True, required=True)
    type = fields.Str(required=True)
    category = fields.Str(required=True)
    note = fields.Str()

    @validates("date")
    def validate_date(self, value: date, **kwargs):
        if value.year < 1990 or value.year > 2100:
            raise ValidationError("date out of range")

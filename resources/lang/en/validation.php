<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'The :attribute must be accepted.',
    'active_url' => 'The :attribute is not a valid URL.',
    'after' => 'The :attribute must be a date after :date.',
    'after_or_equal' => 'The :attribute must be a date after or equal to :date.',
    'alpha' => 'The :attribute may only contain letters.',
    'alpha_dash' => 'The :attribute may only contain letters, numbers, dashes and underscores.',
    'alpha_num' => 'The :attribute may only contain letters and numbers.',
    'array' => 'The :attribute must be an array.',
    'before' => 'The :attribute must be a date before :date.',
    'before_or_equal' => 'The :attribute must be a date before or equal to :date.',
    'between' => [
        'numeric' => 'The :attribute must be between :min and :max.',
        'file' => 'The :attribute must be between :min and :max kilobytes.',
        'string' => 'The :attribute must be between :min and :max characters.',
        'array' => 'The :attribute must have between :min and :max items.',
    ],
    'boolean' => 'The :attribute field must be true or false.',
    'confirmed' => 'The :attribute confirmation does not match.',
    'date' => 'The :attribute is not a valid date.',
    'date_equals' => 'The :attribute must be a date equal to :date.',
    'date_format' => 'The :attribute does not match the format :format.',
    'different' => 'The :attribute and :other must be different.',
    'digits' => 'The :attribute must be :digits digits.',
    'digits_between' => 'The :attribute must be between :min and :max digits.',
    'dimensions' => 'The :attribute has invalid image dimensions.',
    'distinct' => 'The :attribute field has a duplicate value.',
    'email' => 'The :attribute must be a valid email address.',
    'ends_with' => 'The :attribute must end with one of the following: :values.',
    'exists' => 'The selected :attribute is invalid.',
    'file' => 'The :attribute must be a file.',
    'filled' => 'The :attribute field must have a value.',
    'gt' => [
        'numeric' => 'The :attribute must be greater than :value.',
        'file' => 'The :attribute must be greater than :value kilobytes.',
        'string' => 'The :attribute must be greater than :value characters.',
        'array' => 'The :attribute must have more than :value items.',
    ],
    'gte' => [
        'numeric' => 'The :attribute must be greater than or equal :value.',
        'file' => 'The :attribute must be greater than or equal :value kilobytes.',
        'string' => 'The :attribute must be greater than or equal :value characters.',
        'array' => 'The :attribute must have :value items or more.',
    ],
    'image' => 'The :attribute must be an image.',
    'in' => 'The selected :attribute is invalid.',
    'in_array' => 'The :attribute field does not exist in :other.',
    'integer' => 'The :attribute must be an integer.',
    'ip' => 'The :attribute must be a valid IP address.',
    'ipv4' => 'The :attribute must be a valid IPv4 address.',
    'ipv6' => 'The :attribute must be a valid IPv6 address.',
    'json' => 'The :attribute must be a valid JSON string.',
    'lt' => [
        'numeric' => 'The :attribute must be less than :value.',
        'file' => 'The :attribute must be less than :value kilobytes.',
        'string' => 'The :attribute must be less than :value characters.',
        'array' => 'The :attribute must have less than :value items.',
    ],
    'lte' => [
        'numeric' => 'The :attribute must be less than or equal :value.',
        'file' => 'The :attribute must be less than or equal :value kilobytes.',
        'string' => 'The :attribute must be less than or equal :value characters.',
        'array' => 'The :attribute must not have more than :value items.',
    ],
    'max' => [
        'numeric' => ':attribute cannot exceed :max.',
        'file' => ':attribute cannot exceed :max kilobytes.',
        'string' => ':attribute cannot exceed :max characters.',
        'array' => ':attribute cannot exceed :max items.',
    ],
    'mimes' => ':attribute must be a file of type: :values.',
    'mimetypes' => ':attribute must be a file of type: :values.',
    'min' => [
        'numeric' => ':attribute must be at least :min.',
        'file' => ':attribute must be at least :min kilobytes.',
        'string' => ':attribute must be at least :min characters.',
        'array' => ':attribute must be at least :min items.',
    ],
    'not_in' => 'Selected :attribute is invalid.',
    'not_regex' => ':attribute format is invalid.',
    'numeric' => ':attribute must be a number.',
    'password' => 'Incorrect password.',
    'present' => ':attribute must be present.',
    'regex' => ':attribute format is invalid.',
    'required' => ':attribute is required.',
    'required_if' => ':attribute is required when :other is :value.',
    'required_unless' => ':attribute is required unless :other is in :values.',
    'required_with' => ':attribute is required when :values is present.',
    'required_with_all' => ':attribute is required when :values are present.',
    'required_without' => ':attribute is required when :values is not present.',
    'required_without_all' => ':attribute is required when none of :values are present.',
    'same' => ':attribute and :other must match.',
    'size' => [
        'numeric' => ':attribute must be exactly :size.',
        'file' => ':attribute must be exactly :size kilobytes.',
        'string' => ':attribute must be exactly :size characters.',
        'array' => ':attribute must contain exactly :size items.',
    ],
    'starts_with' => 'The :attribute must start with one of the following: :values.',
    'string' => 'The :attribute must be a string.',
    'timezone' => 'The :attribute must be a valid zone.',
    'unique' => 'The :attribute has already been taken.',
    'uploaded' => 'The :attribute failed to upload.',
    'url' => 'The :attribute format is invalid.',
    'uuid' => 'The :attribute must be a valid UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        // AWB Box
        'awb_code' => 'AWB Prefix',
        'awb_no' => 'AWB Number',
        
        // Shipper Address
        'ship_name' => 'Shipper Name',
        'ship_name_2' => 'Shipper Name Line 2',
        'ship_account' => 'Shipper Account',
        'ship_address' => 'Shipper Address',
        'ship_address_line_2' => 'Shipper Address Line 2',
        'ship_city' => 'Shipper City',
        'ship_airport_code' => 'Shipper Airport Code',
        'ship_post_code' => 'Shipper Postal Code',
        'ship_state' => 'Shipper State',
        'ship_country' => 'Shipper Country',
        'ship_phone' => 'Shipper Phone',
        'ship_fax' => 'Shipper Fax',

        // Consignee Address
        'cons_name' => 'Consignee Name',
        'cons_name_2' => 'Consignee Name Line 2',
        'cons_account' => 'Consignee Account',
        'cons_address' => 'Consignee Address',
        'cons_address_line_2' => 'Consignee Address Line 2',
        'cons_city' => 'Consignee City',
        'cons_airport_code' => 'Consignee Airport Code',
        'cons_post_code' => 'Consignee Postal Code',
        'cons_state' => 'Consignee State',
        'cons_country' => 'Consignee Country',
        'cons_phone' => 'Consignee Phone',
        'cons_fax' => 'Consignee Fax',

        // Houseway specific attributes
        'hawb_no' => 'House Airway Bill Number',
        'master_origin' => 'Master Origin',
        'master_destination' => 'Master Destination',
        'master_pcs' => 'Master Pieces',
        'master_weight' => 'Master Weight',
    ],

];

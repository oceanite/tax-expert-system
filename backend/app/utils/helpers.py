def format_applied_rules(applied_rules: list):
    """
    applied_rules: list of dict, setiap dict berisi:
    {
        'rule_id': ...,
        'description': ...,
        'taxable': ...,
        'final': ...,
        'tax_amount': ...
    }
    """
    formatted = []
    for r in applied_rules:
        r_copy = r.copy()
        if r_copy.get("tax_amount") is not None:
            r_copy["tax_amount"] = fmt_currency(r_copy["tax_amount"])
        formatted.append(r_copy)
    return formatted

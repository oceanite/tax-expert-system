def fmt_currency(x):
    try:
        return f"{int(x):,}".replace(",", ".")
    except Exception:
        return str(x)
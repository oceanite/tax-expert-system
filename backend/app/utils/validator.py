from pydantic import BaseModel
from typing import Optional

class UserFactsSchema(BaseModel):
    wp_type: Optional[str]
    wp_residence: Optional[str]
    income_type: Optional[str]
    gaji: Optional[float]
    tunjangan: Optional[float]
    bonus: Optional[float]
    income_amount: Optional[float]
    transaction_type: Optional[str]
    importer_api: Optional[bool]
    product_type: Optional[str]
    harga_jual: Optional[float]
    buyer_type: Optional[str]
    transaction_through: Optional[str]
    rekanan: Optional[bool]
    gold_type: Optional[str]
    luas_bangunan: Optional[float]
    kapasitas_silinder: Optional[float]
    category: Optional[str]
    harga_pembelian: Optional[float]
    dpp_ppn: Optional[float]
    nilai_impor: Optional[float]
    nilai_pembayaran: Optional[float]
    peredaran_bruto: Optional[float]
    nilai_ekspor_bruto: Optional[float]
    biaya_pembuatan: Optional[float]
    harga_barang: Optional[float]
    tarif_ppnbm: Optional[float]
    taxpayer_type: Optional[str]
    via_official_institution: Optional[bool]
    related_to_work: Optional[bool]

def validate_schema(schema: BaseModel, data: dict):
    """Validates user_facts dict using Pydantic schema"""
    try:
        return schema(**data)
    except ValidationError as e:
        raise e

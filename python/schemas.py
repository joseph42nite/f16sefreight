from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, List

T = TypeVar('T')

class ParsedField(BaseModel, Generic[T]):
    """Generic wrapper for parsed fields to include confidence score."""
    value: Optional[T] = None
    confidence: str = "low"  # "high" | "medium" | "low"

class InvoiceItemSchema(BaseModel):
    """Schema for individual line items in a commercial invoice."""
    description: ParsedField[str]
    qty: ParsedField[float]
    unit_rate: ParsedField[float]
    tax_rate: ParsedField[float]
    subtotal: ParsedField[float]
    tax_amount: ParsedField[float]
    total_amount: ParsedField[float]

class CommercialInvoiceSchema(BaseModel):
    """Schema for parsing unstructured commercial invoices."""
    invoice_no: ParsedField[str]
    document_date: ParsedField[str]
    billing_address: ParsedField[str]
    tax_registration_no: ParsedField[str]
    payment_terms: ParsedField[str]
    subtotal: ParsedField[float]
    tax_amount: ParsedField[float]
    grand_total: ParsedField[float]
    currency: ParsedField[str]
    
    # Shipper / Exporter Info
    shipper_name: ParsedField[str]
    shipper_address: ParsedField[str]
    shipper_city: ParsedField[str]
    shipper_post_code: ParsedField[str]
    shipper_state: ParsedField[str]
    shipper_country: ParsedField[str]
    shipper_phone: ParsedField[str]
    
    # Consignee Info
    consignee_name: ParsedField[str]
    consignee_address: ParsedField[str]
    consignee_city: ParsedField[str]
    consignee_post_code: ParsedField[str]
    consignee_state: ParsedField[str]
    consignee_country: ParsedField[str]
    consignee_phone: ParsedField[str]
    
    # Line items
    items: List[InvoiceItemSchema]

class PackingListItemSchema(BaseModel):
    """Schema for individual packages or line items in a packing list."""
    package_number: ParsedField[str]
    description: ParsedField[str]
    qty: ParsedField[float]
    gross_weight: ParsedField[float]
    net_weight: ParsedField[float]
    volume: ParsedField[float]
    dimensions: ParsedField[str]

class PackingListSchema(BaseModel):
    """Schema for parsing unstructured packing lists."""
    packing_list_no: ParsedField[str]
    document_date: ParsedField[str]
    total_packages: ParsedField[int]
    total_gross_weight: ParsedField[float]
    total_volume: ParsedField[float]
    
    # Shipper / Exporter Info
    shipper_name: ParsedField[str]
    shipper_address: ParsedField[str]
    shipper_city: ParsedField[str]
    shipper_post_code: ParsedField[str]
    shipper_state: ParsedField[str]
    shipper_country: ParsedField[str]
    shipper_phone: ParsedField[str]
    
    # Consignee Info
    consignee_name: ParsedField[str]
    consignee_address: ParsedField[str]
    consignee_city: ParsedField[str]
    consignee_post_code: ParsedField[str]
    consignee_state: ParsedField[str]
    consignee_country: ParsedField[str]
    consignee_phone: ParsedField[str]
    
    # Line items
    items: List[PackingListItemSchema]

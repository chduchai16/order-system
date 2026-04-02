package com.example.userservice.domain.model;

import java.util.UUID;

public class ShippingAddress {
    private UUID addressId;
    private String label;
    private String street;
    private String ward;
    private String district;
    private String city;
    private boolean isDefault;

    public ShippingAddress(UUID id, String label,
                           String street, String ward,
                           String district, String city) {
        this.addressId = id;
        this.label = label;
        this.street = street;
        this.ward = ward;
        this.district = district;
        this.city = city;
        this.isDefault = false;
    }

    public UUID getId() {
        return addressId;
    }

    void setDefault() {
        this.isDefault = true;
    }

    void unsetDefault() {
        this.isDefault = false;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public String getLabel() {
        return label;
    }

    public String getStreet() {
        return street;
    }

    public String getWard() {
        return ward;
    }

    public String getDistrict() {
        return district;
    }

    public String getCity() {
        return city;
    }
}

package com.mark.constant;

public enum WriterType {
    MEMBER, GUEST;

    public boolean isMember() { return this == MEMBER; }
    public boolean isGuest() { return this == GUEST; }
}

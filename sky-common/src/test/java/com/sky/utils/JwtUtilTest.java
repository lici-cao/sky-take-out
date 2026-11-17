package com.sky.utils;

import io.jsonwebtoken.security.WeakKeyException;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtUtilTest {

    private static final String SECRET_KEY = "sky-take-out-test-jwt-secret-key-2026";

    @Test
    void shouldCreateAndParseToken() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("empId", 1L);

        String token = JwtUtil.createJWT(SECRET_KEY, 60_000L, claims);

        assertEquals("1", JwtUtil.parseJWT(SECRET_KEY, token).get("empId").toString());
    }

    @Test
    void shouldRejectShortSecretKey() {
        assertThrows(WeakKeyException.class,
                () -> JwtUtil.createJWT("itcast", 60_000L, Map.of()));
    }
}

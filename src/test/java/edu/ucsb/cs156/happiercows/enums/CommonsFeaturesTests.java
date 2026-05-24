package edu.ucsb.cs156.happiercows.enums;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

public class CommonsFeaturesTests {

    @Test
    public void features_contains_expected_value_leaderboard() {
        CommonsFeatures feature = CommonsFeatures.valueOf("FARMERS_CAN_SEE_LEADERBOARD");
        assertNotNull(feature);
        assertEquals(CommonsFeatures.FARMERS_CAN_SEE_LEADERBOARD, feature);
    }

    @Test
    public void features_values_has_single_entry_leaderboard() {
        CommonsFeatures[] values = CommonsFeatures.values();
        assertEquals(1, values.length);
        assertEquals(CommonsFeatures.FARMERS_CAN_SEE_LEADERBOARD, values[0]);
    }
}

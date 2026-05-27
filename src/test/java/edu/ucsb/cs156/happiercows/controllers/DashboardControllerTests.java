package edu.ucsb.cs156.happiercows.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.testconfig.TestConfig;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DashboardController.class)
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class DashboardControllerTests extends ControllerTestCase {

  @MockBean
  UserCommonsRepository userCommonsRepository;

  @Autowired
  ObjectMapper mapper;

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void adminCanGetHistogramData() throws Exception {
    Long commonsId = 1L;

    User user1 = User.builder().id(1L).build();
    User user2 = User.builder().id(2L).build();
    Commons commons = Commons.builder().id(commonsId).build();

    UserCommons userCommons1 =
        UserCommons.builder()
            .user(user1)
            .commons(commons)
            .username("user1")
            .numOfCows(5)
            .build();

    UserCommons userCommons2 =
        UserCommons.builder()
            .user(user2)
            .commons(commons)
            .username("user2")
            .numOfCows(10)
            .build();

    List<UserCommons> expectedResult = new ArrayList<>();
    expectedResult.add(userCommons1);
    expectedResult.add(userCommons2);

    when(userCommonsRepository.findByCommonsId(commonsId)).thenReturn(expectedResult);

    MvcResult response =
        mockMvc
            .perform(get("/api/dashboard/histogram/{id}", commonsId))
            .andExpect(status().isOk())
            .andReturn();

    verify(userCommonsRepository, atLeastOnce()).findByCommonsId(commonsId);

    String responseString = response.getResponse().getContentAsString();
    String expectedResponseString = mapper.writeValueAsString(expectedResult);

    assertEquals(expectedResponseString, responseString);
  }
}
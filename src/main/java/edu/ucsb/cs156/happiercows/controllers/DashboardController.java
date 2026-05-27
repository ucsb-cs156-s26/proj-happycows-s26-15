package edu.ucsb.cs156.happiercows.controllers;

import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Dashboard")
@RequestMapping("/api/dashboard")
@RestController
public class DashboardController {

    @Autowired
    UserCommonsRepository userCommonsRepository;

    @Operation(summary = "Get cow count histogram data for a commons")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/histogram/{id}")
    public Iterable<UserCommons> histogram(@PathVariable Long id) {
        return userCommonsRepository.findByCommonsId(id);
    }
}
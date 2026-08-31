Feature: Generated Astro runtime

  Scenario: ASTRO-GEN-BDD-001 serves the health contract and HTML routes
    Given a built generated Astro application
    When its production runtime is exercised
    Then the health contract and browser routes are available

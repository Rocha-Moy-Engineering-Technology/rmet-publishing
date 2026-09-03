Feature: Reading and engaging with published writing

  Background:
    Given the published site is running

  Scenario: RMET-BDD-001 the landing page lists the writings, newest first
    When the reader opens the landing page
    Then the writings are listed with their publication dates
    And the newest piece is listed first

  Scenario: RMET-BDD-002 a reader opens a piece and finds a place to comment and react
    When the reader opens the first piece on the landing page
    Then the piece shows its title and body
    And the piece offers a comment and reaction area

  Scenario: RMET-BDD-003 a reader reaches the resume and the profiles from the header
    When the reader opens the landing page
    Then the header links to the resume, GitHub, and LinkedIn

  Scenario: RMET-BDD-004 a reader finds the ways to get in touch
    When the reader opens the contact page
    Then the contact page offers an email route
    And the contact page links to GitHub, LinkedIn, and the resume site

  Scenario: RMET-BDD-005 a reader switches the site between dark and light
    When the reader opens the landing page
    And the reader activates the theme toggle
    Then the site records the chosen theme

  Scenario: RMET-BDD-006 a reader subscribes to hear about new writing
    When the reader opens the landing page
    Then the landing page offers an email subscription
    When the reader opens the first piece on the landing page
    And the reader enters an email address and subscribes
    Then the subscription reaches the provider with that address

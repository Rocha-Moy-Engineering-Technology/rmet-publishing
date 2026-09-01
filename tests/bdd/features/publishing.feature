Feature: Reading and engaging with published writing

  Background:
    Given the published site is running

  Scenario: RMET-BDD-001 a reader browses every published piece from one index
    When the reader opens the writing index
    Then every published piece is listed with its kind and publication date

  Scenario: RMET-BDD-002 a reader narrows the library to one kind
    When the reader opens the papers index
    Then only papers are listed

  Scenario: RMET-BDD-003 a reader opens a piece and finds a place to comment and react
    When the reader opens the first piece on the writing index
    Then the piece shows its title and body
    And the piece offers a comment and reaction area

  Scenario: RMET-BDD-004 a reader finds the ways to get in touch
    When the reader opens the contact page
    Then the contact page links to GitHub, LinkedIn, and the resume site
    And the contact page offers an email route

  Scenario: RMET-BDD-005 a reader switches the site between light and dark
    When the reader opens the home page
    And the reader activates the theme toggle
    Then the site records the chosen theme

Feature: Google Main Page

  I want to open a search engine
  
  @focus
  Scenario: Opening a search engine page
    Given I open Google page
    Then I see "google" in the title

  # @focus
  # Scenario: Opening a search engine page2
  #   Given I open Google page
  #   Then I see "google" in the title

  # @focus
  # Scenario: Opening a search engine page3
  #   Given I open Google page
  #   Then I see "google" in the title
Feature: Validate parabank login feature

  @login
  Scenario Outline: Validate user is able to login in
    Given I open parabank home page
    When I enter <username> and <password>

    Examples:
      | username | password |
      | "demo"   | "demo"   |
      | "demo1"  | "demo1"  |
      | "demo2"  | "demo2"  |
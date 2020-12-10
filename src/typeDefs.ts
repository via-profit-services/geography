import gql from 'graphql-tag';

const schema = gql`

  extend type Query {
    geography: GeographyQuery!
  }

  type GeographyQuery {
    """
    Returns Cities list bundle
    """
    cities(
      first: Int
      offset: Int
      after: String
      orderBy: [CitiesListOrderBy]
      filter: CitiesListFilter
      search: CitiesSearch
    ): CitiesListConnection!

    """
    Returns States list bundle
    """
    states(
      first: Int
      offset: Int
      after: String
      orderBy: [StatesListOrderBy]
      filter: StatesListFilter
      search: StatesSearch
    ): StatesListConnection!

    """
    Returns Countries list bundle
    """
    countries(
      first: Int
      offset: Int
      after: String
      orderBy: [CountriesListOrderBy]
      filter: CountriesListFilter
      search: CountriesSearch
    ): CountriesListConnection!

    country(id: ID!): Country
    state(id: ID!): State
    city(id: ID!): City

  }



  """
  Possible data to order list of cities
  """
  input CitiesListOrderBy {
    field: CitiesListOrderField!
    direction: OrderDirection!
  }

  """
  Possible data to order list of states
  """
  input StatesListOrderBy {
    field: StatesListOrderField!
    direction: OrderDirection!
  }

  """
  Possible data to order list of countries
  """
  input CountriesListOrderBy {
    field: CountriesListOrderField!
    direction: OrderDirection!
  }


  enum CitiesSearchFields{
    en
    ru
  }

  enum StatesSearchFields{
    en
    ru
    stateCode
  }

  enum CountriesSearchFields{
    en
    ru
    iso2
    iso3
  }

  input CitiesSearch {
    fields: [CitiesSearchFields!]!
    query: String!
  }

  input StatesSearch {
    fields: [StatesSearchFields!]!
    query: String!
  }

  input CountriesSearch {
    fields: [CountriesSearchFields!]!
    query: String!
  }


  input CitiesListFilter {
    state: [ID]
    stateCode: [String]
    country: [ID]
    countryCode: [String]
    timezone: [String]
  }

  input StatesListFilter {
    id: [ID]
    stateCode: [String]
    country: [ID]
    countryCode: [String]
  }

  input CountriesListFilter {
    id: [ID]
    iso3: [String]
    iso2: [String]
    phoneCode: [String]
    currency: [String]
    capital: [ID]
  }


  enum CitiesListOrderField {
    en
    ru
    state
    stateCode
    country
    countryCode
    timezone
  }

  enum StatesListOrderField {
    en
    ru
    stateCode
    countryCode
    country
  }

  enum CountriesListOrderField {
    en
    ru
    iso2
    iso3
    currency
  }

  """
  Cities list connection
  """
  type CitiesListConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [CitiesEdge]!
  }

  """
  Countries list connection
  """
  type CountriesListConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [CountriesEdge]!
  }

  """
  States list connection
  """
  type StatesListConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [StatesEdge]!
  }


  """
  City edge bundle
  """
  type CitiesEdge{
    node: City!
    cursor: String!
  }

  """
  Countries edge bundle
  """
  type CountriesEdge {
    node: Country!
    cursor: String!
  }

  """
  States edge bundle
  """
  type StatesEdge {
    node: State!
    cursor: String!
  }

  type Country {
    id: ID!

    """
    Original name
    """
    en: String!

    """
    The name translated into Russian language
    """
    ru: String!
    iso3: String!
    iso2: String!
    phoneCode: String!
    currency: String!
    capital: City
  }

  type State {
    id: ID!
    """
    Original name
    """
    en: String!

    """
    The name translated into Russian language
    """
    ru: String!
    country: Country!
    countryCode: String!
    stateCode: String!
  }

  type City {
    id: ID!
    """
    Original name
    """
    en: String!

    """
    The name translated into Russian language
    """
    ru: String!
    country: Country!
    countryCode: String!
    state: State!
    stateCode: String!
    latitude: String!
    longitude: String!
    timezone: String!
  }



`;

export default schema;

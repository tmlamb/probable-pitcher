INSERT INTO "user" (
  id,
  email,
  email_verified,
  image
)
VALUES
  (
    'e312a8dc-bcaa-4452-9371-3701a88cda18',
    'test1@probablepitcher.com',
    NULL,
    NULL
  );

INSERT INTO "user" (
  id,
  email,
  email_verified,
  image
)
VALUES
  (
    '548e899a-2e4e-4413-aad6-15a87b69661d',
    'test2@probablepitcher.com',
    NULL,
    NULL
  );

INSERT INTO "user" (
  id,
  email,
  email_verified,
  image
)
VALUES
  (
    'ad6632a5-d6d8-469d-aae6-22c1ff53c58a',
    'test3@probablepitcher.com',
    NULL,
    NULL
  );

INSERT INTO
  account (
    user_id,
    type,
    provider,
    provider_account_id,
    refresh_token,
    access_token,
    expires_at,
    token_type,
    scope,
    id_token,
    session_state
  )
VALUES
  (
    'e312a8dc-bcaa-4452-9371-3701a88cda18',
    'oauth',
    'google',
    '123456789101112131415',
    NULL,
    'test_access_token_1',
    1970188389,
    'Bearer',
    'openid',
    'test_id_token_1',
    NULL
  );

INSERT INTO
  account (
    user_id,
    type,
    provider,
    provider_account_id,
    refresh_token,
    access_token,
    expires_at,
    token_type,
    scope,
    id_token,
    session_state
  )
VALUES
  (
    '548e899a-2e4e-4413-aad6-15a87b69661d',
    'oauth',
    'google',
    '123456789101112131416',
    NULL,
    'test_access_token_2',
    1970188389,
    'Bearer',
    'openid',
    'test_id_token_2',
    NULL
  );

INSERT INTO
  account (
    user_id,
    type,
    provider,
    provider_account_id,
    refresh_token,
    access_token,
    expires_at,
    token_type,
    scope,
    id_token,
    session_state
  )
VALUES
  (
    'ad6632a5-d6d8-469d-aae6-22c1ff53c58a',
    'oauth',
    'google',
    '123456789101112131417',
    NULL,
    'test_access_token_3',
    1970188389,
    'Bearer',
    'openid',
    'test_id_token_3',
    NULL
  );

INSERT INTO
  session (session_token, user_id, expires)
VALUES
  (
    '1c2358f5-51e0-4be5-ae8e-312a6b9888e1',
    'e312a8dc-bcaa-4452-9371-3701a88cda18',
    '2049-03-14 10:12:11.256'
  );

INSERT INTO
  session (session_token, user_id, expires)
VALUES
  (
    '2c2358f5-51e0-4be5-ae8e-312a6b9888e2',
    '548e899a-2e4e-4413-aad6-15a87b69661d',
    '2049-03-14 10:12:11.256'
  );

INSERT INTO
  session (session_token, user_id, expires)
VALUES
  (
    '3c2358f5-51e0-4be5-ae8e-312a6b9888e3',
    'ad6632a5-d6d8-469d-aae6-22c1ff53c58a',
    '2049-03-14 10:12:11.256'
  );

INSERT INTO
  device (
    id,
    user_id,
    push_token,
    timezone,
    notifications_enabled
  )
VALUES
  (
    'f37e86c4-4d5c-4a4e-95c7-fd4c382c8644',
    'e312a8dc-bcaa-4452-9371-3701a88cda18',
    'test_push_token_1',
    'America/New_York',
    true
  );

INSERT INTO
  device (
    id,
    user_id,
    push_token,
    timezone,
    notifications_enabled
  )
VALUES
  (
    'f71d0614-e86b-43e5-a6ea-f4d7816a6e46',
    '548e899a-2e4e-4413-aad6-15a87b69661d',
    'test_push_token_2',
    'Europe/London',
    true
  );

INSERT INTO
  device (
    id,
    user_id,
    push_token,
    timezone,
    notifications_enabled
  )
VALUES
  (
    'fadbca0c-de64-4e25-9de7-bea768bc81aa',
    'ad6632a5-d6d8-469d-aae6-22c1ff53c58a',
    'test_push_token_3',
    'America/New_York',
    true
  );

INSERT INTO
  device (
    id,
    user_id,
    push_token,
    timezone,
    notifications_enabled
  )
VALUES
  (
    'fadbca0c-de64-4e25-9de7-bea768bc81aa2',
    'ad6632a5-d6d8-469d-aae6-22c1ff53c58a',
    'test_push_token_32',
    'America/New_York',
    false
  );


INSERT INTO
  team (id, ref, name, abbreviation)
VALUES
  ('6e1bc9b2-0ae4-4484-b9ed-b3e8d4c86580', 1, 'Springfield Artichokes', 'SPA');

INSERT INTO
  team (id, ref, name, abbreviation)
VALUES
  ('da940603-baa0-48b7-a5e5-4f5376bbf757', 2, 'Shelbyville Beets', 'SBE');

INSERT INTO
  team (id, ref, name, abbreviation)
VALUES
  ('8dd43e52-8037-47f3-a13a-53a5d039ac66', 3, 'Ogdenville Oranges', 'OGO');

INSERT INTO
  team (id, ref, name, abbreviation)
VALUES
  ('f489b23d-9189-4b6b-86f6-805df48eb6f0', 4, 'North Haverbrook Monorails', 'NHM');

INSERT INTO
  team (id, ref, name, abbreviation)
VALUES
  ('4a0ab259-768f-4609-b3eb-05688178e6b9', 5, 'Brockway Broncos', 'BRO');

INSERT INTO
  team (id, ref, name, abbreviation)
VALUES
  ('31d12596-7771-4910-a3fb-609cf86747aa', 6, 'Capital City Goofballers', 'CCG');

INSERT INTO
  pitcher (
    id,
    ref,
    name,
    team_id,
    primary_number
  )
VALUES
  (
    '6ae0fbb7-4ad8-4aaa-a8ab-97748ce1c5da',
    1,
    'Johnny Appleseed',
    '6e1bc9b2-0ae4-4484-b9ed-b3e8d4c86580',
    '1'
  );

INSERT INTO
  pitcher (
    id,
    ref,
    name,
    team_id,
    primary_number
  )
VALUES
  (
    'e3e6a1b0-34b9-43f3-8a5f-bcba844f5425',
    2,
    'Bobby Banana',
    'da940603-baa0-48b7-a5e5-4f5376bbf757',
    '2'
  );

INSERT INTO
  pitcher (
    id,
    ref,
    name,
    team_id,
    primary_number
  )
VALUES
  (
    'f1d41eb6-8572-47dc-889b-586508964d7e',
    3,
    'Charlie Cherry',
    '8dd43e52-8037-47f3-a13a-53a5d039ac66',
    '3'
  );

INSERT INTO
  pitcher (
    id,
    ref,
    name,
    team_id,
    primary_number
  )
VALUES
  (
    '0034c398-f528-434a-9e5a-e0a7ab1dedab',
    4,
    'Danny Date',
    'f489b23d-9189-4b6b-86f6-805df48eb6f0',
    '4'
  );

INSERT INTO
  pitcher (
    id,
    ref,
    name,
    team_id,
    primary_number
  )
VALUES
  (
    '3236eaf0-266f-49a2-9b7c-a5394b0c1e96',
    5,
    'Eddie Elderberry',
    '4a0ab259-768f-4609-b3eb-05688178e6b9',
    '5'
  );

INSERT INTO
  pitcher (
    id,
    ref,
    name,
    team_id,
    primary_number
  )
VALUES
  (
    '4bd13920-5564-423e-ba4a-81e9079230af',
    6,
    'Freddy Fig',
    '31d12596-7771-4910-a3fb-609cf86747aa',
    '6'
  );

INSERT INTO
  game (
    id,
    ref,
    date,
    home_pitcher_id,
    away_pitcher_id
  )
VALUES
  (
    '9a91c26a-f3e4-4c48-a132-fd6774cbe0e5',
    1,
    '2022-03-14 10:12:11.256',
    '6ae0fbb7-4ad8-4aaa-a8ab-97748ce1c5da',
    'e3e6a1b0-34b9-43f3-8a5f-bcba844f5425'
  );

INSERT INTO
  game (
    id,
    ref,
    date,
    home_pitcher_id,
    away_pitcher_id
  )
VALUES
  (
    'd2605427-d775-4047-8b3e-e93a68fc214a',
    2,
    '2022-03-14 10:12:11.256',
    'f1d41eb6-8572-47dc-889b-586508964d7e',
    '0034c398-f528-434a-9e5a-e0a7ab1dedab'
  );

INSERT INTO
  game (
    id,
    ref,
    date,
    home_pitcher_id,
    away_pitcher_id
  )
VALUES
  (
    '2fd81f88-3f1a-4492-978b-307703589c8b',
    3,
    '2022-03-14 10:12:11.256',
    '3236eaf0-266f-49a2-9b7c-a5394b0c1e96',
    '4bd13920-5564-423e-ba4a-81e9079230af'
  );

INSERT INTO
  subscription (
    id,
    user_id,
    pitcher_id
  )
VALUES
  (
    '469aceb4-2081-4714-823a-35f15ca1f6f6',
    'e312a8dc-bcaa-4452-9371-3701a88cda18',
    '6ae0fbb7-4ad8-4aaa-a8ab-97748ce1c5da'
  );

INSERT INTO
  subscription (
    id,
    user_id,
    pitcher_id
  )
VALUES
  (
    '4ec4f24a-c444-49bb-b318-0fec614c94f7',
    '548e899a-2e4e-4413-aad6-15a87b69661d',
    'e3e6a1b0-34b9-43f3-8a5f-bcba844f5425'
  );

INSERT INTO
  subscription (
    id,
    user_id,
    pitcher_id
  )
VALUES
  (
    'b099b64e-1f9c-403c-bf58-348e88aa2312',
    'ad6632a5-d6d8-469d-aae6-22c1ff53c58a',
    'f1d41eb6-8572-47dc-889b-586508964d7e'
  );

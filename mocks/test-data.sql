INSERT INTO "user" (
  id,
  name,
  email,
  email_verified,
  image,
  created_at,
  updated_at
)
VALUES
  (
    'e111a8dc-bcaa-4452-9371-3701a88c111e',
    'User 1',
    'test1@example.com',
    true,
    NULL,
    '2022-08-11 15:12:11.256',
    '2022-08-11 15:12:11.256'
  );

INSERT INTO "user" (
  id,
  name,
  email,
  email_verified,
  image,
  created_at,
  updated_at
)
VALUES
  (
    'e222899a-2e4e-4413-aad6-15a87b69222e',
    'User 2',
    'test2@example.com',
    true,
    NULL,
    '2022-08-11 15:12:11.256',
    '2022-08-11 15:12:11.256'
  );

INSERT INTO "user" (
  id,
  name,
  email,
  email_verified,
  image,
  created_at,
  updated_at
)
VALUES
  (
    'e33332a5-d6d8-469d-aae6-22c1ff53333e',
    'User 3',
    'test3@example.com',
    true,
    NULL,
    '2022-08-11 15:12:11.256',
    '2022-08-11 15:12:11.256'
  );

INSERT INTO "user" (
  id,
  name,
  email,
  email_verified,
  image,
  created_at,
  updated_at
)
VALUES
  (
    'e44442e4-2962-4ed7-99ea-c64d248d444e',
    'User 4',
    'test4@example.com',
    true,
    NULL,
    '2022-08-11 15:12:11.256',
    '2022-08-11 15:12:11.256'
  );

INSERT INTO "user" (
  id,
  name,
  email,
  email_verified,
  image,
  created_at,
  updated_at
)
VALUES
  (
    'e555bfa9-4dbf-42da-8f8d-348a7364555e',
    'User 5',
    'test5@example.com',
    true,
    NULL,
    '2022-08-11 15:12:11.256',
    '2022-08-11 15:12:11.256'
  );

INSERT INTO "user" (
  id,
  name,
  email,
  email_verified,
  image,
  created_at,
  updated_at
)
VALUES
  (
    'e666cadc-f752-4646-ad6b-419be06f666e',
    'User 6',
    'test6@example.com',
    true,
    NULL,
    '2022-08-11 15:12:11.256',
    '2022-08-11 15:12:11.256'
  );

INSERT INTO "user" (
  id,
  name,
  email,
  email_verified,
  image,
  created_at,
  updated_at
)
VALUES
  (
    'e777a9b7-2b65-4a8d-b476-6eb5fda8777e',
    'User 7',
    'test7@example.com',
    true,
    NULL,
    '2022-08-11 15:12:11.256',
    '2022-08-11 15:12:11.256'
  );

INSERT INTO
  account (
    id,
    account_id,
    provider_id,
    user_id,
    access_token,
    refresh_token,
    id_token,
    access_token_expires_at,
    refresh_token_expires_at,
    scope,
    password,
    created_at,
    updated_at
  )
VALUES
  (
    '2fdc40da-06a3-43ba-b6c5-b12e262007ca',
    '1c7a6ffd-a809-4799-b53e-c138b922ea17',
    'google',
    'e111a8dc-bcaa-4452-9371-3701a88c111e',
    'ya29.a0AfH6SMB9',
    NULL,
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQwMjIzZjI',
    '2050-08-14 15:12:11.256',
    NULL,
    'openid,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email',
    NULL,
    '2022-08-11 15:12:11.256',
    '2022-08-11 15:12:11.256'
  );

INSERT INTO
  account (
    id,
    account_id,
    provider_id,
    user_id,
    access_token,
    refresh_token,
    id_token,
    access_token_expires_at,
    refresh_token_expires_at,
    scope,
    password,
    created_at,
    updated_at
  )
VALUES
  (
    '66864c35-bfe2-4536-9219-9e8cccddc0e0',
    'f1009d43-0330-49a2-8445-aa63d3565cfe',
    'google',
    'e222899a-2e4e-4413-aad6-15a87b69222e',
    'ya29.a0AfH',
    NULL,
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQwMjIzZjI',
    '2050-08-14 15:12:11.256',
    NULL,
    'openid,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email',
    NULL,
    '2022-08-11 15:12:11.256',
    '2022-08-11 15:12:11.256'
  );

INSERT INTO
  account (
    id,
    account_id,
    provider_id,
    user_id,
    access_token,
    refresh_token,
    id_token,
    access_token_expires_at,
    refresh_token_expires_at,
    scope,
    password,
    created_at,
    updated_at
  )
VALUES
  (
    '058b66ae-a455-4e90-a34d-903d420cc3da',
    '67f90bdb-08be-4b55-bfa6-65f71f08716d',
    'google',
    'e33332a5-d6d8-469d-aae6-22c1ff53333e',
    'ya29.a0AfH6SMB9',
    NULL,
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQwMjIzZjI',
    '2050-08-14 15:12:11.256',
    NULL,
    'openid,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email',
    NULL,
    '2022-08-11 15:12:11.256',
    '2022-08-11 15:12:11.256'
  );

INSERT INTO
  account (
    id,
    account_id,
    provider_id,
    user_id,
    access_token,
    refresh_token,
    id_token,
    access_token_expires_at,
    refresh_token_expires_at,
    scope,
    password,
    created_at,
    updated_at
  )
VALUES
  (
    'aab403e0-8443-4c09-a0e8-f464e3c84250',
    'd9a3c803-14a6-46e9-9232-da284b191245',
    'google',
    'e44442e4-2962-4ed7-99ea-c64d248d444e',
    'ya29.a0AfH',
    NULL,
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQwMjIzZjI',
    '2050-08-14 15:12:11.256',
    NULL,
    'openid,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email',
    NULL,
    '2022-08-11 15:12:11.256',
    '2022-08-11 15:12:11.256'
  );

INSERT INTO
  account (
    id,
    account_id,
    provider_id,
    user_id,
    access_token,
    refresh_token,
    id_token,
    access_token_expires_at,
    refresh_token_expires_at,
    scope,
    password,
    created_at,
    updated_at
  )
VALUES
  (
    'aace4169-d695-4770-9995-852c391fc281',
    '7d63fa4e-fdb4-413f-b324-63da551416b6',
    'google',
    'e555bfa9-4dbf-42da-8f8d-348a7364555e',
    'ya29.a0AfH',
    NULL,
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQwMjIzZjI',
    '2050-08-14 15:12:11.256',
    NULL,
    'openid,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email',
    NULL,
    '2022-08-11 15:12:11.256',
    '2022-08-11 15:12:11.256'
  );

INSERT INTO
  account (
    id,
    account_id,
    provider_id,
    user_id,
    access_token,
    refresh_token,
    id_token,
    access_token_expires_at,
    refresh_token_expires_at,
    scope,
    password,
    created_at,
    updated_at
  )
VALUES
  (
    '603da545-a077-4a70-84f3-8f22bdd07520',
    'd1e6ad5e-8da3-4bbb-a770-ab9442133276',
    'google',
    'e666cadc-f752-4646-ad6b-419be06f666e',
    'ya29.a0AfH6SMB9',
    NULL,
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQwMjIzZjI',
    '2050-08-14 15:12:11.256',
    NULL,
    'openid,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email',
    NULL,
    '2022-08-11 15:12:11.256',
    '2022-08-11 15:12:11.256'
  );

INSERT INTO
  account (
    id,
    account_id,
    provider_id,
    user_id,
    access_token,
    refresh_token,
    id_token,
    access_token_expires_at,
    refresh_token_expires_at,
    scope,
    password,
    created_at,
    updated_at
  )
VALUES
  (
    '8994c787-ffaa-4f0f-afc7-fb75dd98dee9',
    'da777abe-aaf1-4cc9-a0e2-1d394e702711',
    'google',
    'e777a9b7-2b65-4a8d-b476-6eb5fda8777e',
    'ya29.a0AfH',
    NULL,
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQwMjIzZjI',
    '2050-08-14 15:12:11.256',
    NULL,
    'openid,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email',
    NULL,
    '2022-08-11 15:12:11.256',
    '2022-08-11 15:12:11.256'
  );

INSERT INTO
  apikey (
    id,
    name,
    start,
    prefix,
    key,
    user_id,
    refill_interval,
    refill_amount,
    last_refill_at,
    enabled,
    rate_limit_enabled,
    rate_limit_time_window,
    rate_limit_max,
    request_count,
    remaining,
    last_request,
    expires_at,
    created_at,
    updated_at,
    permissions,
    metadata
  )
VALUES
  (
    '3UK0YMAyxnSSwnjlIMEfrQdLRziCBa0d',
    NULL,
    'UAWNAs',
    NULL,
    'NFrWIcI8StC51HBJm5tQJjqlEGNH4TaVmw8hySh4304',
    'e111a8dc-bcaa-4452-9371-3701a88c111e',
    NULL,
    NULL,
    NULL,
    true,
    false,
    86400000,
    10,
    0,
    NULL,
    NULL,
    NULL,
    '2025-04-09T01:01:09.794Z',
    '2025-04-09T01:01:09.794Z',
    NULL,
    NULL
  );

INSERT INTO
  apikey (
    id,
    name,
    start,
    prefix,
    key,
    user_id,
    refill_interval,
    refill_amount,
    last_refill_at,
    enabled,
    rate_limit_enabled,
    rate_limit_time_window,
    rate_limit_max,
    request_count,
    remaining,
    last_request,
    expires_at,
    created_at,
    updated_at,
    permissions,
    metadata
  )
VALUES
  (
    'NarLxYPUSMeLbzh54DpIN5KVZcmEjhf9',
    NULL,
    'PNaqyE',
    NULL,
    'Tm12neit_DMY9UVP5cTM3859JfIICNXQdAdE4ctp52U',
    'e222899a-2e4e-4413-aad6-15a87b69222e',
    NULL,
    NULL,
    NULL,
    true,
    false,
    86400000,
    10,
    0,
    NULL,
    NULL,
    NULL,
    '2025-04-09T01:01:09.794Z',
    '2025-04-09T01:01:09.794Z',
    NULL,
    NULL
  );

INSERT INTO
  apikey (
    id,
    name,
    start,
    prefix,
    key,
    user_id,
    refill_interval,
    refill_amount,
    last_refill_at,
    enabled,
    rate_limit_enabled,
    rate_limit_time_window,
    rate_limit_max,
    request_count,
    remaining,
    last_request,
    expires_at,
    created_at,
    updated_at,
    permissions,
    metadata
  )
VALUES
  (
    'hqINsYQUtF2m4Z9gHq2MYjjdlRK7fupl',
    NULL,
    'WgmQgb',
    NULL,
    'stVDzLmYvatWCITzlU1lVaMd9pV6ilPnnVdmCwaYyQA',
    'e33332a5-d6d8-469d-aae6-22c1ff53333e',
    NULL,
    NULL,
    NULL,
    true,
    false,
    86400000,
    10,
    0,
    NULL,
    NULL,
    NULL,
    '2025-04-09T01:01:09.794Z',
    '2025-04-09T01:01:09.794Z',
    NULL,
    NULL
  );

INSERT INTO
  apikey (
    id,
    name,
    start,
    prefix,
    key,
    user_id,
    refill_interval,
    refill_amount,
    last_refill_at,
    enabled,
    rate_limit_enabled,
    rate_limit_time_window,
    rate_limit_max,
    request_count,
    remaining,
    last_request,
    expires_at,
    created_at,
    updated_at,
    permissions,
    metadata
  )
VALUES
  (
    'tEWcvuIx6VA3h5RFpFqWyN8q7NiaEOQK',
    NULL,
    'dsbxHI',
    NULL,
    'xfS8S6lInN_5foS3S2HclXNPOjelnwUPP0s4s0HA1gM',
    'e44442e4-2962-4ed7-99ea-c64d248d444e',
    NULL,
    NULL,
    NULL,
    true,
    false,
    86400000,
    10,
    0,
    NULL,
    NULL,
    NULL,
    '2025-04-09T01:01:09.794Z',
    '2025-04-09T01:01:09.794Z',
    NULL,
    NULL
  );

INSERT INTO
  apikey (
    id,
    name,
    start,
    prefix,
    key,
    user_id,
    refill_interval,
    refill_amount,
    last_refill_at,
    enabled,
    rate_limit_enabled,
    rate_limit_time_window,
    rate_limit_max,
    request_count,
    remaining,
    last_request,
    expires_at,
    created_at,
    updated_at,
    permissions,
    metadata
  )
VALUES
  (
    '1r82uTBprhZ122awH9I6Q1DTWkJ8LeaG',
    NULL,
    'wdKXjG',
    NULL,
    'a5Dm-SYsxQyKZWjCxwXj0adH4Qt_1u5B_XBH8lL60Ac',
    'e555bfa9-4dbf-42da-8f8d-348a7364555e',
    NULL,
    NULL,
    NULL,
    true,
    false,
    86400000,
    10,
    0,
    NULL,
    NULL,
    NULL,
    '2025-04-09T01:01:09.794Z',
    '2025-04-09T01:01:09.794Z',
    NULL,
    NULL
  );

INSERT INTO
  apikey (
    id,
    name,
    start,
    prefix,
    key,
    user_id,
    refill_interval,
    refill_amount,
    last_refill_at,
    enabled,
    rate_limit_enabled,
    rate_limit_time_window,
    rate_limit_max,
    request_count,
    remaining,
    last_request,
    expires_at,
    created_at,
    updated_at,
    permissions,
    metadata
  )
VALUES
  (
    'XpyNw52pEsi9UduWHHnsqHX0knhZjrby',
    NULL,
    'eXsPBE',
    NULL,
    'uM8BNioKq5Li5KYdnaFTCy6X67jiVDkc1do4NFAcalQ',
    'e666cadc-f752-4646-ad6b-419be06f666e',
    NULL,
    NULL,
    NULL,
    true,
    false,
    86400000,
    10,
    0,
    NULL,
    NULL,
    NULL,
    '2025-04-09T01:01:09.794Z',
    '2025-04-09T01:01:09.794Z',
    NULL,
    NULL
  );

INSERT INTO
  apikey (
    id,
    name,
    start,
    prefix,
    key,
    user_id,
    refill_interval,
    refill_amount,
    last_refill_at,
    enabled,
    rate_limit_enabled,
    rate_limit_time_window,
    rate_limit_max,
    request_count,
    remaining,
    last_request,
    expires_at,
    created_at,
    updated_at,
    permissions,
    metadata
  )
VALUES
  (
    'FkvV1xuxm6mIVuDfA76kFKu2yWdSoTpL',
    NULL,
    'lHiMku',
    NULL,
    'qq_wYfr1Et71QjZVo52LRSJpnCyiJf6zj11a9sTr_64',
    'e777a9b7-2b65-4a8d-b476-6eb5fda8777e',
    NULL,
    NULL,
    NULL,
    true,
    false,
    86400000,
    10,
    0,
    NULL,
    NULL,
    NULL,
    '2025-04-09T01:01:09.794Z',
    '2025-04-09T01:01:09.794Z',
    NULL,
    NULL
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
    'd11186c4-4d5c-4a4e-95c7-fd4c382c111d',
    'e111a8dc-bcaa-4452-9371-3701a88c111e',
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
    'd2220614-e86b-43e5-a6ea-f4d7816a222d',
    'e222899a-2e4e-4413-aad6-15a87b69222e',
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
    'd333ca0c-de64-4e25-9de7-bea768bc333d',
    'e33332a5-d6d8-469d-aae6-22c1ff53333e',
    'test_push_token_3',
    'America/Los_Angeles',
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
    'd3232a0c-de64-4e25-9de7-bea768b2323d',
    'e33332a5-d6d8-469d-aae6-22c1ff53333e',
    'test_push_token_32',
    'America/New_York',
    false
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
    'd444ca0c-de64-4e25-9de7-bea768b8444d',
    'e44442e4-2962-4ed7-99ea-c64d248d444e',
    'test_push_token_4',
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
    'd4242c0c-de64-4e25-9de7-bea768b2424d',
    'e44442e4-2962-4ed7-99ea-c64d248d444e',
    'test_push_token_42',
    'America/Chicago',
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
    'd555ca0c-de64-4e25-9de7-bea768bc555d',
    'e555bfa9-4dbf-42da-8f8d-348a7364555e',
    'test_push_token_5',
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
    'd5252a0c-de64-4e25-9de7-bea768b2525d',
    'e555bfa9-4dbf-42da-8f8d-348a7364555e',
    'test_push_token_52',
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
    'd666ca0c-de64-4e25-9de7-bea768bc666d',
    'e666cadc-f752-4646-ad6b-419be06f666e',
    'test_push_token_6',
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
    'd777aa0c-de64-4e25-9de7-bea768ba777d',
    'e777a9b7-2b65-4a8d-b476-6eb5fda8777e',
    'test_push_token_62',
    'America/New_York',
    true
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
    number
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
    number
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
    number
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
    number
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
    number
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
    number
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
  pitcher (
    id,
    ref,
    name,
    team_id,
    number
  )
VALUES
  (
    '5c1b1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b',
    7,
    'Gerry Grape',
    '6e1bc9b2-0ae4-4484-b9ed-b3e8d4c86580',
    '7'
  );

INSERT INTO
  pitcher (
    id,
    ref,
    name,
    team_id,
    number
  )
VALUES
  (
    '6d1d1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b',
    8,
    'Harry Honeydew',
    'da940603-baa0-48b7-a5e5-4f5376bbf757',
    '8'
  );

INSERT INTO
  pitcher (
    id,
    ref,
    name,
    team_id,
    number
  )
VALUES
  (
    '7e1f1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b',
    9,
    'Izzy Iceberg',
    '8dd43e52-8037-47f3-a13a-53a5d039ac66',
    '9'
  );

INSERT INTO
  pitcher (
    id,
    ref,
    name,
    team_id,
    number
  )
VALUES
  (
    '8f1f1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b',
    10,
    'Jack Jackfruit',
    'f489b23d-9189-4b6b-86f6-805df48eb6f0',
    '10'
  );

INSERT INTO
  pitcher (
    id,
    ref,
    name,
    team_id,
    number
  )
VALUES
  (
    '9a1f1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b',
    11,
    'Kenny Kiwi',
    '4a0ab259-768f-4609-b3eb-05688178e6b9',
    '11'
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
    'a111c26a-f3e4-4c48-a132-fd6774cb111a',
    1,
    '2022-08-15 02:12:11.256Z',
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
    'a2225427-d775-4047-8b3e-e93a68fc222a',
    2,
    '2022-08-14 19:00:11.256Z',
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
    'a3331f88-3f1a-4492-978b-30770358333a',
    3,
    '2022-08-14 15:12:11.256Z',
    '3236eaf0-266f-49a2-9b7c-a5394b0c1e96',
    '4bd13920-5564-423e-ba4a-81e9079230af'
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
    'a4441f88-3f1a-4492-978b-30770358444a',
    4,
    '2022-08-14 02:00:11.256Z',
    '5c1b1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b',
    '6d1d1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b'
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
    'a5551f88-3f1a-4492-978b-30770358555a',
    5,
    '2022-08-14 15:12:11.256Z',
    '7e1f1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b',
    NULL
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
    'a6661f88-3f1a-4492-978b-30770358666a',
    6,
    '2022-08-13 20:11:00.257Z',
    '8f1f1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b',
    '9a1f1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b'
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
    'e111a8dc-bcaa-4452-9371-3701a88c111e',
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
    'e3d4041c-efae-4694-8dc7-588ce9b67ab8',
    'e111a8dc-bcaa-4452-9371-3701a88c111e',
    '8f1f1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b'
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
    'e222899a-2e4e-4413-aad6-15a87b69222e',
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
    'e33332a5-d6d8-469d-aae6-22c1ff53333e',
    'f1d41eb6-8572-47dc-889b-586508964d7e'
  );

INSERT INTO
  subscription (
    id,
    user_id,
    pitcher_id
  )
VALUES
  (
    'b1b1b1b1-1b1b-1b1b-1b1b-1b1b1b1b1b1b',
    'e44442e4-2962-4ed7-99ea-c64d248d444e',
    '0034c398-f528-434a-9e5a-e0a7ab1dedab'
  );

INSERT INTO
  subscription (
    id,
    user_id,
    pitcher_id
  )
VALUES
  (
    '7545c7b2-f097-482d-8989-832506fe7a26',
    'e44442e4-2962-4ed7-99ea-c64d248d444e',
    '9a1f1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b'
  );

INSERT INTO
  subscription (
    id,
    user_id,
    pitcher_id
  )
VALUES
  (
    'b2b2b2b2-2b2b-2b2b-2b2b-2b2b2b2b2b2b',
    'e555bfa9-4dbf-42da-8f8d-348a7364555e',
    '3236eaf0-266f-49a2-9b7c-a5394b0c1e96'
  );

INSERT INTO
  subscription (
    id,
    user_id,
    pitcher_id
  )
VALUES
  (
    'b3b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b',
    'e222899a-2e4e-4413-aad6-15a87b69222e',
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
    'b4b4b4b4-4b4b-4b4b-4b4b-4b4b4b4b4b4b',
    'e33332a5-d6d8-469d-aae6-22c1ff53333e',
    '5c1b1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b'
  );

INSERT INTO
  subscription (
    id,
    user_id,
    pitcher_id
  )
VALUES
  (
    'b5b5b5b5-5b5b-5b5b-5b5b-5b5b5b5b5b5b',
    'e666cadc-f752-4646-ad6b-419be06f666e',
    '6d1d1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b'
  );

INSERT INTO
  subscription (
    id,
    user_id,
    pitcher_id
  )
VALUES
  (
    'b6b6b6b6-6b6b-6b6b-6b6b-6b6b6b6b6b6b',
    'e777a9b7-2b65-4a8d-b476-6eb5fda8777e',
    '7e1f1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b'
  );

-- Verify previous day's sent notifications are not sent again today
INSERT INTO
  notification (
    id,
    device_id,
    game_id,
    pitcher_id,
    sent_on
  )
VALUES
  (
    'd4f254b5-4be9-4f80-8b27-e3719acd6dc7',
    'd11186c4-4d5c-4a4e-95c7-fd4c382c111d',
    'a6661f88-3f1a-4492-978b-30770358666a',
    '8f1f1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b',
    '2022-08-13 14:00:01.256Z'
  );

-- Verify previous day's unsent notifications are not sent today
INSERT INTO
  notification (
    id,
    device_id,
    game_id,
    pitcher_id,
    sent_on
  )
VALUES
  (
    '706323bf-d04c-438b-af08-c1713b0980d0',
    'd444ca0c-de64-4e25-9de7-bea768b8444d',
    'a6661f88-3f1a-4492-978b-30770358666a',
    '9a1f1f3b-1b1b-4b1b-8b1b-1b1b1b1b1b1b',
    null
  );

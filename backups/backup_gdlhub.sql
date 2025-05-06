--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 16.8 (Debian 16.8-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: gdlhub
--

CREATE TABLE public.restaurants (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.restaurants OWNER TO gdlhub;

--
-- Name: restaurants_id_seq; Type: SEQUENCE; Schema: public; Owner: gdlhub
--

CREATE SEQUENCE public.restaurants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.restaurants_id_seq OWNER TO gdlhub;

--
-- Name: restaurants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gdlhub
--

ALTER SEQUENCE public.restaurants_id_seq OWNED BY public.restaurants.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: gdlhub
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO gdlhub;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: gdlhub
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO gdlhub;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gdlhub
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: restaurants id; Type: DEFAULT; Schema: public; Owner: gdlhub
--

ALTER TABLE ONLY public.restaurants ALTER COLUMN id SET DEFAULT nextval('public.restaurants_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: gdlhub
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: gdlhub
--

COPY public.restaurants (id, name, description, address, created_at) FROM stdin;
1	Tacos El Güero	Tacos al pastor y bistec	Av. Patria 234	2025-05-06 01:44:31.9558
2	Mariscos El Chapo	Cocteles y ceviches	Calle Marlin 12	2025-05-06 01:44:31.9558
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: gdlhub
--

COPY public.users (id, name, email, created_at) FROM stdin;
1	John Doe	john@gmail.com	2025-05-06 01:44:31.952927
2	Jane Doe	jane@gmail.com	2025-05-06 01:44:31.952927
\.


--
-- Name: restaurants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gdlhub
--

SELECT pg_catalog.setval('public.restaurants_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gdlhub
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: gdlhub
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: gdlhub
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: gdlhub
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--


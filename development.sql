--
-- PostgreSQL database dump
--

-- Dumped from database version 10.17 (Ubuntu 10.17-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.17 (Ubuntu 10.17-0ubuntu0.18.04.1)

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

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: Competency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Competency" (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public."Competency" OWNER TO postgres;

--
-- Name: Competency_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Competency_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Competency_id_seq" OWNER TO postgres;

--
-- Name: Competency_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Competency_id_seq" OWNED BY public."Competency".id;


--
-- Name: competency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.competency (
    id integer NOT NULL,
    title character varying NOT NULL,
    seniority_id integer NOT NULL
);


ALTER TABLE public.competency OWNER TO postgres;

--
-- Name: competency_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.competency_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.competency_id_seq OWNER TO postgres;

--
-- Name: competency_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.competency_id_seq OWNED BY public.competency.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: seniority; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seniority (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.seniority OWNER TO postgres;

--
-- Name: seniority_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seniority_entity (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.seniority_entity OWNER TO postgres;

--
-- Name: seniority_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seniority_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.seniority_entity_id_seq OWNER TO postgres;

--
-- Name: seniority_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seniority_entity_id_seq OWNED BY public.seniority_entity.id;


--
-- Name: seniority_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seniority_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.seniority_id_seq OWNER TO postgres;

--
-- Name: seniority_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seniority_id_seq OWNED BY public.seniority.id;


--
-- Name: sub_competency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sub_competency (
    id integer NOT NULL,
    title character varying NOT NULL,
    competency_id integer NOT NULL
);


ALTER TABLE public.sub_competency OWNER TO postgres;

--
-- Name: sub_competency_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sub_competency_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sub_competency_id_seq OWNER TO postgres;

--
-- Name: sub_competency_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sub_competency_id_seq OWNED BY public.sub_competency.id;


--
-- Name: subcompetency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subcompetency (
    id integer NOT NULL,
    title character varying NOT NULL,
    competency_id integer NOT NULL,
    test_bool boolean DEFAULT false NOT NULL,
    date_time_with_timezone timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.subcompetency OWNER TO postgres;

--
-- Name: subcompetency_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subcompetency_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subcompetency_id_seq OWNER TO postgres;

--
-- Name: subcompetency_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subcompetency_id_seq OWNED BY public.subcompetency.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    identification_number integer NOT NULL,
    email character varying NOT NULL,
    fname character varying NOT NULL,
    lname character varying NOT NULL,
    mname character varying NOT NULL,
    age integer NOT NULL,
    phone character varying NOT NULL,
    is_active boolean NOT NULL,
    seniority_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_competency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_competency (
    id integer NOT NULL,
    competency_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_competency OWNER TO postgres;

--
-- Name: user_competency_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_competency_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_competency_id_seq OWNER TO postgres;

--
-- Name: user_competency_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_competency_id_seq OWNED BY public.user_competency.id;


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: user_subcompetency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_subcompetency (
    id integer NOT NULL,
    "Subcompetency_id" integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    subcompetency_id integer NOT NULL
);


ALTER TABLE public.user_subcompetency OWNER TO postgres;

--
-- Name: user_subcompetency_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_subcompetency_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_subcompetency_id_seq OWNER TO postgres;

--
-- Name: user_subcompetency_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_subcompetency_id_seq OWNED BY public.user_subcompetency.id;


--
-- Name: Competency id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Competency" ALTER COLUMN id SET DEFAULT nextval('public."Competency_id_seq"'::regclass);


--
-- Name: competency id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.competency ALTER COLUMN id SET DEFAULT nextval('public.competency_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: seniority id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seniority ALTER COLUMN id SET DEFAULT nextval('public.seniority_id_seq'::regclass);


--
-- Name: seniority_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seniority_entity ALTER COLUMN id SET DEFAULT nextval('public.seniority_entity_id_seq'::regclass);


--
-- Name: sub_competency id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_competency ALTER COLUMN id SET DEFAULT nextval('public.sub_competency_id_seq'::regclass);


--
-- Name: subcompetency id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcompetency ALTER COLUMN id SET DEFAULT nextval('public.subcompetency_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: user_competency id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_competency ALTER COLUMN id SET DEFAULT nextval('public.user_competency_id_seq'::regclass);


--
-- Name: user_subcompetency id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_subcompetency ALTER COLUMN id SET DEFAULT nextval('public.user_subcompetency_id_seq'::regclass);


--
-- Data for Name: Competency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Competency" (id, title) FROM stdin;
\.


--
-- Data for Name: competency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.competency (id, title, seniority_id) FROM stdin;
1	Competency 1	1
3	Competency 2	1
4	Competency 3	1
20	Competency 4	2
21	Competency 5	2
22	Competency 6	2
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
\.


--
-- Data for Name: seniority; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seniority (id, title) FROM stdin;
1	Test 1
2	Test 2
3	Test 3
\.


--
-- Data for Name: seniority_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seniority_entity (id, title) FROM stdin;
\.


--
-- Data for Name: sub_competency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sub_competency (id, title, competency_id) FROM stdin;
\.


--
-- Data for Name: subcompetency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subcompetency (id, title, competency_id, test_bool, date_time_with_timezone, created_at, updated_at) FROM stdin;
2	Sub competency 2	3	f	\N	2021-06-16 16:33:18.192056	2021-06-16 16:33:18.192056
5	Sub competency  4	20	f	\N	2021-06-16 16:33:18.192056	2021-06-16 16:33:18.192056
6	Sub competency  5	20	f	\N	2021-06-16 16:33:18.192056	2021-06-16 16:33:18.192056
7	Sub competency  6	21	f	\N	2021-06-16 16:33:18.192056	2021-06-16 16:33:18.192056
3	Sub competency 3	4	f	\N	2021-06-16 16:33:18.192056	2021-06-16 16:33:18.192056
1	Sub competency 1	1	t	\N	2021-06-16 16:33:18.192056	2021-06-16 16:33:18.192056
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, identification_number, email, fname, lname, mname, age, phone, is_active, seniority_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_competency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_competency (id, competency_id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_subcompetency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_subcompetency (id, "Subcompetency_id", user_id, created_at, updated_at, subcompetency_id) FROM stdin;
\.


--
-- Name: Competency_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Competency_id_seq"', 1, false);


--
-- Name: competency_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.competency_id_seq', 22, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);


--
-- Name: seniority_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seniority_entity_id_seq', 1, false);


--
-- Name: seniority_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seniority_id_seq', 3, true);


--
-- Name: sub_competency_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sub_competency_id_seq', 1, false);


--
-- Name: subcompetency_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subcompetency_id_seq', 7, true);


--
-- Name: user_competency_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_competency_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 1, false);


--
-- Name: user_subcompetency_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_subcompetency_id_seq', 1, false);


--
-- Name: subcompetency PK_0a8367917cb2b5ca7be9c3ebd2c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcompetency
    ADD CONSTRAINT "PK_0a8367917cb2b5ca7be9c3ebd2c" PRIMARY KEY (id);


--
-- Name: user_subcompetency PK_2c06e42329c5cb34cabca54495e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_subcompetency
    ADD CONSTRAINT "PK_2c06e42329c5cb34cabca54495e" PRIMARY KEY (id);


--
-- Name: seniority PK_396dcd0aaf42987d9cf14b175d1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seniority
    ADD CONSTRAINT "PK_396dcd0aaf42987d9cf14b175d1" PRIMARY KEY (id);


--
-- Name: sub_competency PK_4c1f29ca3cadb7a199f63b1951c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_competency
    ADD CONSTRAINT "PK_4c1f29ca3cadb7a199f63b1951c" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: seniority_entity PK_8e45a5af58590fd5825a4da29d2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seniority_entity
    ADD CONSTRAINT "PK_8e45a5af58590fd5825a4da29d2" PRIMARY KEY (id);


--
-- Name: user_competency PK_922b4be8fec123e269291a39584; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_competency
    ADD CONSTRAINT "PK_922b4be8fec123e269291a39584" PRIMARY KEY (id);


--
-- Name: competency PK_9b9cd5b5654e3900e92f6956436; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.competency
    ADD CONSTRAINT "PK_9b9cd5b5654e3900e92f6956436" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: Competency PK_e10e6d8370964c9ae7169e51cb9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Competency"
    ADD CONSTRAINT "PK_e10e6d8370964c9ae7169e51cb9" PRIMARY KEY (id);


--
-- Name: IDX_1402f229f04ef67a88cbcf582a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_1402f229f04ef67a88cbcf582a" ON public.user_competency USING btree (user_id);


--
-- Name: IDX_167c281134a2ee20ced5943b65; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_167c281134a2ee20ced5943b65" ON public."user" USING btree (seniority_id);


--
-- Name: IDX_2ee261f007752d7258bc0c0ba5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_2ee261f007752d7258bc0c0ba5" ON public.subcompetency USING btree (competency_id);


--
-- Name: IDX_41a4336c3dc23449263ee5a0dd; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_41a4336c3dc23449263ee5a0dd" ON public."user" USING btree (identification_number);


--
-- Name: IDX_6f2fe366bdd2c2236f188c9c61; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6f2fe366bdd2c2236f188c9c61" ON public.user_subcompetency USING btree ("Subcompetency_id");


--
-- Name: IDX_75b7a55d870cf963cc380f0f90; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_75b7a55d870cf963cc380f0f90" ON public.user_subcompetency USING btree (user_id);


--
-- Name: IDX_9de0d947874ad22672e3c01489; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_9de0d947874ad22672e3c01489" ON public.user_competency USING btree (competency_id);


--
-- Name: IDX_ae544c7fa29da84ef6711bbcdc; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ae544c7fa29da84ef6711bbcdc" ON public.sub_competency USING btree (competency_id);


--
-- Name: IDX_b251b25d59d17ed8de008bc180; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b251b25d59d17ed8de008bc180" ON public.competency USING btree (seniority_id);


--
-- Name: IDX_e12875dfb3b1d92d7d7c5377e2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON public."user" USING btree (email);


--
-- Name: user_competency FK_1402f229f04ef67a88cbcf582a0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_competency
    ADD CONSTRAINT "FK_1402f229f04ef67a88cbcf582a0" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: user FK_167c281134a2ee20ced5943b65a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_167c281134a2ee20ced5943b65a" FOREIGN KEY (seniority_id) REFERENCES public.seniority(id);


--
-- Name: subcompetency FK_2ee261f007752d7258bc0c0ba53; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcompetency
    ADD CONSTRAINT "FK_2ee261f007752d7258bc0c0ba53" FOREIGN KEY (competency_id) REFERENCES public.competency(id);


--
-- Name: user_subcompetency FK_75b7a55d870cf963cc380f0f90d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_subcompetency
    ADD CONSTRAINT "FK_75b7a55d870cf963cc380f0f90d" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: user_subcompetency FK_7843faef2c21709dfacbed27dad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_subcompetency
    ADD CONSTRAINT "FK_7843faef2c21709dfacbed27dad" FOREIGN KEY (subcompetency_id) REFERENCES public.subcompetency(id);


--
-- Name: user_competency FK_9de0d947874ad22672e3c014893; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_competency
    ADD CONSTRAINT "FK_9de0d947874ad22672e3c014893" FOREIGN KEY (competency_id) REFERENCES public.competency(id);


--
-- Name: sub_competency FK_ae544c7fa29da84ef6711bbcdc8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_competency
    ADD CONSTRAINT "FK_ae544c7fa29da84ef6711bbcdc8" FOREIGN KEY (competency_id) REFERENCES public.competency(id);


--
-- Name: competency FK_b251b25d59d17ed8de008bc1808; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.competency
    ADD CONSTRAINT "FK_b251b25d59d17ed8de008bc1808" FOREIGN KEY (seniority_id) REFERENCES public.seniority(id);


--
-- PostgreSQL database dump complete
--


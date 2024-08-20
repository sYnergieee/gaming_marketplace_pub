--
-- gaming_marketplace_db_userQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

-- Started on 2024-06-02 14:44:00

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
-- TOC entry 5 (class 2615 OID 39281)
-- Name: public; Type: SCHEMA; Schema: -; Owner: gaming_marketplace_db_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: gaming_marketplace_db_user
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 236 (class 1259 OID 39434)
-- Name: administrators; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.administrators (
    id integer NOT NULL
);


ALTER TABLE public.administrators OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 239 (class 1259 OID 39455)
-- Name: applications; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    game_name character varying(255) NOT NULL,
    salesman_id integer
);


ALTER TABLE public.applications OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 238 (class 1259 OID 39454)
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.applications_id_seq OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 238
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- TOC entry 231 (class 1259 OID 39369)
-- Name: characteristic_games; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.characteristic_games (
    game_id integer NOT NULL,
    characteristic_id integer NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.characteristic_games OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 223 (class 1259 OID 39312)
-- Name: characteristics; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.characteristics (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    unit character varying(255)
);


ALTER TABLE public.characteristics OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 222 (class 1259 OID 39311)
-- Name: characteristics_id_seq; Type: SEQUENCE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE SEQUENCE public.characteristics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.characteristics_id_seq OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 222
-- Name: characteristics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER SEQUENCE public.characteristics_id_seq OWNED BY public.characteristics.id;


--
-- TOC entry 244 (class 1259 OID 41499)
-- Name: customer_products; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.customer_products (
    key_id integer NOT NULL,
    review text,
    purshase_date timestamp without time zone,
    customer_id integer,
    customer_status_id integer
);


ALTER TABLE public.customer_products OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 234 (class 1259 OID 39414)
-- Name: customers; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.customers (
    id integer NOT NULL
);


ALTER TABLE public.customers OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 232 (class 1259 OID 39384)
-- Name: game_genres; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.game_genres (
    game_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.game_genres OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 233 (class 1259 OID 39399)
-- Name: game_platforms; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.game_platforms (
    game_id integer NOT NULL,
    platform_id integer NOT NULL
);


ALTER TABLE public.game_platforms OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 227 (class 1259 OID 39328)
-- Name: games; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.games (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    release_date timestamp without time zone NOT NULL,
    img character varying(255),
    publisher_id integer
);


ALTER TABLE public.games OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 226 (class 1259 OID 39327)
-- Name: games_id_seq; Type: SEQUENCE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE SEQUENCE public.games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.games_id_seq OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 226
-- Name: games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER SEQUENCE public.games_id_seq OWNED BY public.games.id;


--
-- TOC entry 225 (class 1259 OID 39321)
-- Name: genres; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.genres (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.genres OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 224 (class 1259 OID 39320)
-- Name: genres_id_seq; Type: SEQUENCE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE SEQUENCE public.genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genres_id_seq OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 224
-- Name: genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER SEQUENCE public.genres_id_seq OWNED BY public.genres.id;


--
-- TOC entry 243 (class 1259 OID 41486)
-- Name: keys; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.keys (
    id integer NOT NULL,
    code character varying(1024) NOT NULL,
    is_used boolean,
    product_id integer
);


ALTER TABLE public.keys OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 242 (class 1259 OID 41485)
-- Name: keys_id_seq; Type: SEQUENCE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE SEQUENCE public.keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.keys_id_seq OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 242
-- Name: keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER SEQUENCE public.keys_id_seq OWNED BY public.keys.id;


--
-- TOC entry 228 (class 1259 OID 39341)
-- Name: permissions; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.permissions (
    role_id integer NOT NULL,
    url character varying(50) NOT NULL
);


ALTER TABLE public.permissions OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 221 (class 1259 OID 39305)
-- Name: platforms; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.platforms (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.platforms OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 220 (class 1259 OID 39304)
-- Name: platforms_id_seq; Type: SEQUENCE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE SEQUENCE public.platforms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.platforms_id_seq OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 220
-- Name: platforms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER SEQUENCE public.platforms_id_seq OWNED BY public.platforms.id;


--
-- TOC entry 241 (class 1259 OID 41457)
-- Name: products; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    price integer NOT NULL,
    published_date timestamp without time zone,
    game_id integer,
    salesman_id integer,
    product_status_id integer,
    platform_id integer
);


ALTER TABLE public.products OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 240 (class 1259 OID 41456)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 240
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 217 (class 1259 OID 39291)
-- Name: publishers; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.publishers (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.publishers OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 216 (class 1259 OID 39290)
-- Name: publishers_id_seq; Type: SEQUENCE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE SEQUENCE public.publishers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.publishers_id_seq OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 216
-- Name: publishers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER SEQUENCE public.publishers_id_seq OWNED BY public.publishers.id;


--
-- TOC entry 237 (class 1259 OID 39444)
-- Name: recoveries; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.recoveries (
    code character varying(255) NOT NULL,
    user_id integer,
    created timestamp without time zone
);


ALTER TABLE public.recoveries OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 219 (class 1259 OID 39298)
-- Name: roles; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.roles OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 218 (class 1259 OID 39297)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 218
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 235 (class 1259 OID 39424)
-- Name: salesmans; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.salesmans (
    id integer NOT NULL
);


ALTER TABLE public.salesmans OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 215 (class 1259 OID 39284)
-- Name: statuses; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.statuses (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.statuses OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 214 (class 1259 OID 39283)
-- Name: statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE SEQUENCE public.statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.statuses_id_seq OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 214
-- Name: statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER SEQUENCE public.statuses_id_seq OWNED BY public.statuses.id;


--
-- TOC entry 230 (class 1259 OID 39352)
-- Name: users; Type: TABLE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nickname character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    firstname character varying(255) NOT NULL,
    lastname character varying(255) NOT NULL,
    birthdate timestamp without time zone NOT NULL,
    reg_date timestamp without time zone,
    telegram character varying(255),
    discord character varying(255),
    img character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role_id integer
);


ALTER TABLE public.users OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 229 (class 1259 OID 39351)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: gaming_marketplace_db_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO gaming_marketplace_db_user;

--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 229
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3267 (class 2604 OID 39458)
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- TOC entry 3263 (class 2604 OID 39315)
-- Name: characteristics id; Type: DEFAULT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.characteristics ALTER COLUMN id SET DEFAULT nextval('public.characteristics_id_seq'::regclass);


--
-- TOC entry 3265 (class 2604 OID 39331)
-- Name: games id; Type: DEFAULT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.games ALTER COLUMN id SET DEFAULT nextval('public.games_id_seq'::regclass);


--
-- TOC entry 3264 (class 2604 OID 39324)
-- Name: genres id; Type: DEFAULT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.genres ALTER COLUMN id SET DEFAULT nextval('public.genres_id_seq'::regclass);


--
-- TOC entry 3269 (class 2604 OID 41489)
-- Name: keys id; Type: DEFAULT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.keys ALTER COLUMN id SET DEFAULT nextval('public.keys_id_seq'::regclass);


--
-- TOC entry 3262 (class 2604 OID 39308)
-- Name: platforms id; Type: DEFAULT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.platforms ALTER COLUMN id SET DEFAULT nextval('public.platforms_id_seq'::regclass);


--
-- TOC entry 3268 (class 2604 OID 41460)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 3260 (class 2604 OID 39294)
-- Name: publishers id; Type: DEFAULT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.publishers ALTER COLUMN id SET DEFAULT nextval('public.publishers_id_seq'::regclass);


--
-- TOC entry 3261 (class 2604 OID 39301)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 3259 (class 2604 OID 39287)
-- Name: statuses id; Type: DEFAULT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.statuses ALTER COLUMN id SET DEFAULT nextval('public.statuses_id_seq'::regclass);


--
-- TOC entry 3266 (class 2604 OID 39355)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3500 (class 0 OID 39434)
-- Dependencies: 236
-- Data for Name: administrators; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.administrators (id) FROM stdin;
2
\.


--
-- TOC entry 3503 (class 0 OID 39455)
-- Dependencies: 239
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.applications (id, game_name, salesman_id) FROM stdin;
1	the witcher 3	3
2	divinity original sin 2	3
3	baldurs gate 3	5
4	portal 2	5
\.


--
-- TOC entry 3495 (class 0 OID 39369)
-- Dependencies: 231
-- Data for Name: characteristic_games; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.characteristic_games (game_id, characteristic_id, value) FROM stdin;
1	1	2 ОЗУ
1	2	3
1	4	Microsoft® Windows® 7/8/8.1/10
1	5	DirectX® 11 compatible
1	6	11
1	7	Pentium® 4 1.5 GHz / Athlon® XP
1	8	DirectX® 11 compatible
2	2	150
2	4	Windows 10 64-bit
2	5	Nvidia GTX 970 / RX 480 (4GB+ of VRAM)
2	6	11
2	7	Intel I5 4690 / AMD FX 8350
\.


--
-- TOC entry 3487 (class 0 OID 39312)
-- Dependencies: 223
-- Data for Name: characteristics; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.characteristics (id, name, unit) FROM stdin;
1	Оперативная память	ГБ
2	Место на диске	ГБ
3	Сеть	
4	ОС	\N
5	Видеокарта	\N
6	DirectX	Версия
7	Процессор	
8	Звуковая карта	\N
11	string	string
\.


--
-- TOC entry 3508 (class 0 OID 41499)
-- Dependencies: 244
-- Data for Name: customer_products; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.customer_products (key_id, review, purshase_date, customer_id, customer_status_id) FROM stdin;
2	Ну это полный шлак	2024-04-29 12:53:01.666167	1	3
4	все хорошо, мне понравилось!	2024-05-18 18:40:02.461553	1	2
7	Продукт хороший, автор молодец, не обманул	2023-08-12 10:52:00.588055	1	2
9	sss	2024-02-07 18:48:04.524756	1	4
10	\N	2024-02-07 18:48:04.524756	1	1
16	\N	2024-05-18 18:26:45.811048	1	1
17	\N	2023-08-12 14:11:38.963682	4	1
20	\N	2023-08-12 14:53:35.276039	4	1
8	ddd	2023-08-12 11:06:30.389703	1	4
\.


--
-- TOC entry 3498 (class 0 OID 39414)
-- Dependencies: 234
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.customers (id) FROM stdin;
1
4
\.


--
-- TOC entry 3496 (class 0 OID 39384)
-- Dependencies: 232
-- Data for Name: game_genres; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.game_genres (game_id, genre_id) FROM stdin;
1	9
1	10
1	11
2	3
2	12
\.


--
-- TOC entry 3497 (class 0 OID 39399)
-- Dependencies: 233
-- Data for Name: game_platforms; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.game_platforms (game_id, platform_id) FROM stdin;
1	1
2	1
2	2
2	3
1	2
\.


--
-- TOC entry 3491 (class 0 OID 39328)
-- Dependencies: 227
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.games (id, name, description, release_date, img, publisher_id) FROM stdin;
1	Love, Money, Rock'n'Roll	"Любовь, Деньги, Рок-н-Ролл": романтика 80-х, тайны и интриги, предательство и самопожертвование, ненависть и страсть – всё это новая игра от создателей легендарной новеллы «Бесконечное Лето»!	2022-08-04 00:00:00	1_game.jpg	2
2	Baldur's Gate 3	Соберите отряд и вернитесь в Забытые Королевства. Вас ждет история о дружбе и предательстве, выживании и самопожертвовании, о сладком зове абсолютной власти.\n	2023-08-03 00:00:00	2_game.jpg	3
\.


--
-- TOC entry 3489 (class 0 OID 39321)
-- Dependencies: 225
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.genres (id, name) FROM stdin;
1	Экшен
2	Приключения
3	Ролевая
4	Симулятор
5	Стратегия
6	Гонка
7	Шутер
8	Хоррор
9	Визуальная новелла
10	Аниме
11	Романтика
12	Фэнтези
\.


--
-- TOC entry 3507 (class 0 OID 41486)
-- Dependencies: 243
-- Data for Name: keys; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.keys (id, code, is_used, product_id) FROM stdin;
2	gAAAAABmL27MEfY3MimkOtqW8bphhz-_FtXFqA0-7H52etr33trWBb9_WDfMcXboAzXR5LQCPOaX1x9SkMJXARDIvuZ9qIFPeA==	t	7
3	gAAAAABmSMEzFiS0IsgvI5KvLKxs6SqnTdTHdenK92RaFHGGlHT1RL8bQJLP9pZrs8eb23MlAx0THPNhTzqvToOu7GjSoaTBdg==	f	7
4	gAAAAABmSME45e6jvfCg1ERjdWndVOOKQeRaTMFqgdAAmWE5RHywrrLbqKv70wqACBvUfcarJS0y7S0rXrYu38nSN2RLsgQ88g==	t	7
7	gAAAAABmL2s-nce3lCNp0cYqJkq6s5Vo5Qk3O7uk-bmGtO6CdYDaFu9_KlJl9aa5gAWZlXr2nFkM9kSBL_3rBMX-8JAY4UEZv8pZRzfE4QXjHGQjOeB0PWI=	t	5
8	gAAAAABmL2s1zf_inj9JTaHgn-N5ONT9Ppa8TuU1eRUeLuigf48dfNovDmFIj_Rpq5wrGp3SJHlkTFj4ArvEIDnG2rmTO03RJaJEKF5tBf71KxiFGaEynxc=	t	5
9	gAAAAABmL2sqzGtTJa_DMghPjJRSbg2rm7fb_JdTrW0HTm9SStcNxA_7WGan88ey-YXvasTGZaHYN_yMm7yN4xAxIdKFZmTkAxpStVq-gMsliaax-q_rXu8=	t	5
10	gAAAAABmL2sfkS7grSOLlOQ83eyhi3am1xSRy77vmTuoLxWureLXIvyxyVIryOvpAfvVEMVvn6C_j2aI1R8dYpowGRLZGfqs6CeIIQJ2igT_Jf6ecJ4UioE=	t	5
11	gAAAAABmL2sVQMCRydxkoDErI1c_zFKrPySSChTQM3fngMHJ4ZheJnEE05bsTRikifqYyzyHDJnNWTSTSjUtk0dx7Me24PHylwz4QblLFQFSxFAkStKvXTc=	f	5
12	gAAAAABmL2sJcwVnwbbkyWcX_zz2bGfW11nfiq1Zv0E4GurF_gkml01ELZYOfuH4KxzwsChC7rlrfa1BnVjvErHQjgsH7BfHYHnAal1xRwb5LRx8SElEQBs=	f	5
13	gAAAAABmL2r7hoekChlWUOlI-2VfKuBrUrGRzcZUOFnIs3TwUPSeJUeaFN8kpC4BTrRITsSeA_kzc1BTuT_GTD5PmXYnEP_wN-OU58jywdGWlM9zFa0BU_w=	f	5
14	gAAAAABmL2rq2eazBa9vAlsk0WwVnsyaIAh5cl3SsQh_293uDc3hsf7-SeHmP17nfO21GTv-rPIecasiPYZv5BkdrxWIrUK_O78587dw430-ClH8mN-8uKs=	f	5
15	gAAAAABmL2rdSN6WwXT5z4NQ0trP7CcL7bIfWGDotypHtPpEPVJKKo4OxfmozcfsDK5bVxpIQKhZIcjXA8PnVV4kdQFi-F9UdO2Bt9zZ6mzDYA3vIVR1Tes=	f	5
16	gAAAAABmL2rQCf6wZPXpiRT3yMKFrQQj0y3LofYnQ9lDYjFWhf6lcBNas_9017AF0eoEwzZt3qdhPTCQbXUa6M5brGU9aW8dcRfp9YllPkW6pkIGhSzhVZg=	t	5
17	gAAAAABmL2rAMjgXb0f0PFF_5kWltPJeEczz8M9xyb84BTE1SL44F0LOmyBVCmz_XFh1odMPJFAhZrCnx3DAR03eGGprGLyJyEGk77PR9ibrbWUJLACuh5E=	t	6
18	gAAAAABmL2rAMjgXb0f0PFF_5kWltPJeEczz8M9xyb84BTE1SL44F0LOmyBVCmz_XFh1odMPJFAhZrCnx3DAR03eGGprGLyJyEGk77PR9ibrbWUJLACuh5E=	f	6
19	gAAAAABmL2qscf0Db-AWvNucMHyjwSH_BO8avisachAV2M38mXqeo8c1-63kuZ_TQEH1hSgOFz-98lH1BHEEJW_2vwg9iU1_gSBWL0CyEAn8NT9eyr4zVPY=	f	6
20	gAAAAABmL2qU5ODsbDu8lnzfpiHbJkgtNGg5AGLUPV8gTy71VGaaoxy1Wt7T6nzh5zCDDVDJtWDPXpPnYy1BX_c7hY1Sy6JtZw==	t	7
\.


--
-- TOC entry 3492 (class 0 OID 39341)
-- Dependencies: 228
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.permissions (role_id, url) FROM stdin;
1	/game/post_application
1	/product/delete_key
1	/product/post_key_product
1	/product/post_product
1	/product/put_product
2	/product/post_customer_product
2	/product/put_customer_product
3	/game/delete_application
3	/game/delete_characteristic
3	/game/delete_game
3	/game/delete_game_characteristic
3	/game/delete_genre
3	/game/delete_platform
3	/game/delete_publisher
3	/game/post_characteristic
3	/game/post_game
3	/game/post_game_characteristic
3	/game/post_genre
3	/game/post_platform
3	/game/post_publisher
3	/game/put_characteristic
3	/game/put_game
3	/game/put_game_characteristic
3	/game/put_genre
3	/game/put_platform
3	/game/put_publisher
3	/product/delete_key
3	/product/put_product
3	/product/put_stat_customer_product
3	/product/put_stat_product
3	/const/get_prod_neg_not_proc
\.


--
-- TOC entry 3485 (class 0 OID 39305)
-- Dependencies: 221
-- Data for Name: platforms; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.platforms (id, name) FROM stdin;
1	Steam
2	Epic Games Store
3	Origin
4	Uplay
5	GOG
6	Battle.net
\.


--
-- TOC entry 3505 (class 0 OID 41457)
-- Dependencies: 241
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.products (id, name, description, price, published_date, game_id, salesman_id, product_status_id, platform_id) FROM stdin;
6	LoveMoneyRocknRoll Steam	Лучший продукт, гарантия 100%, моментальная доставка	300	2023-08-12 11:06:30.398735	1	5	6	2
7	dddd	dsadas	2	2023-08-12 14:53:35.285665	2	3	5	1
5	LoveMoneyRocknRoll	Работает по всей стране, дешевле чем в официальном магазине, гарантия 100%	200	2023-08-12 10:24:03.355842	1	3	6	1
1	sss	2222	123	2024-06-02 14:40:19.300163	2	3	6	2
\.


--
-- TOC entry 3481 (class 0 OID 39291)
-- Dependencies: 217
-- Data for Name: publishers; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.publishers (id, name) FROM stdin;
1	 Ubisoft
2	Soviet Games
3	Larian Studios
\.


--
-- TOC entry 3501 (class 0 OID 39444)
-- Dependencies: 237
-- Data for Name: recoveries; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.recoveries (code, user_id, created) FROM stdin;
svoxlimvalrsqxvysfwocwovhctirtat	1	2024-05-26 18:37:15.694055
\.


--
-- TOC entry 3483 (class 0 OID 39298)
-- Dependencies: 219
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.roles (id, name) FROM stdin;
1	Продавец
2	Покупатель
3	Администратор
\.


--
-- TOC entry 3499 (class 0 OID 39424)
-- Dependencies: 235
-- Data for Name: salesmans; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.salesmans (id) FROM stdin;
3
5
\.


--
-- TOC entry 3479 (class 0 OID 39284)
-- Dependencies: 215
-- Data for Name: statuses; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.statuses (id, name) FROM stdin;
1	Нет отзыва
2	Положительный отзыв
3	Отрицательный отзыв: необработанный
4	Отрицательный отзыв: обработанный
5	Продукт заблокирован
6	Продукт доступен
\.


--
-- TOC entry 3494 (class 0 OID 39352)
-- Dependencies: 230
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: gaming_marketplace_db_user
--

COPY public.users (id, nickname, email, firstname, lastname, birthdate, reg_date, telegram, discord, img, password, role_id) FROM stdin;
2	katsum1	katsumiproo@gmail.com	Егор	Григоренко	1993-06-08 00:00:00	2023-08-11 19:55:29.263782	\N	john	administrator.png	$2b$12$hY0YkOez2lmqDtO.jY61S.bLqYuCczJmndSdW8oQF919f1gqWknfS	3
4	user	user@example.com	Алексей	Вопоп	1998-06-16 00:00:00	2023-08-11 19:55:29.263782	@skambik	\N	customer.png	$2b$12$2a8WqRT2MGAnBy1Zmik7puTeqHKdZgl4VXI923.1/DMDuTgoiU84.	2
5	jojoboy	userr@example.com	Евстафий	Евлампиев	2017-02-07 00:00:00	2023-08-11 19:55:29.263782	\N	\N	salesman.png	$2b$12$Lt5yr1eYnKcfFXmXYe83eenAVLJpGHdEsDEnyb7yEL4p4I3V2ITTu	1
3	maksim_isaev	maksim228775@gmail.com	Скам	Веаси	1994-03-15 00:00:00	2023-08-11 19:55:29.263782	\N	\N	salesman.png	$2b$12$HOs.1w2N91LSY1/vhwQshuF22YBZGEr2VJyyajbyLzvTf2zuouLQe	1
1	sYnergie	ngtumaksimisaev@gmail.com	Максим	Исаев	2002-02-20 00:00:00	2023-08-11 19:55:29.263782	@sYnergie	synergie_	customer.png	$2b$12$9t2VvSef4/aaK/Rpu4hveuBWn/8xJmV3hSjNyEJ0KtDNmWp1gDuq2	2
\.


--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 238
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gaming_marketplace_db_user
--

SELECT pg_catalog.setval('public.applications_id_seq', 1, false);


--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 222
-- Name: characteristics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gaming_marketplace_db_user
--

SELECT pg_catalog.setval('public.characteristics_id_seq', 11, true);


--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 226
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gaming_marketplace_db_user
--

SELECT pg_catalog.setval('public.games_id_seq', 1, false);


--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 224
-- Name: genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gaming_marketplace_db_user
--

SELECT pg_catalog.setval('public.genres_id_seq', 1, false);


--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 242
-- Name: keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gaming_marketplace_db_user
--

SELECT pg_catalog.setval('public.keys_id_seq', 1, false);


--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 220
-- Name: platforms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gaming_marketplace_db_user
--

SELECT pg_catalog.setval('public.platforms_id_seq', 1, false);


--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 240
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gaming_marketplace_db_user
--

SELECT pg_catalog.setval('public.products_id_seq', 1, true);


--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 216
-- Name: publishers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gaming_marketplace_db_user
--

SELECT pg_catalog.setval('public.publishers_id_seq', 1, false);


--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 218
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gaming_marketplace_db_user
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- TOC entry 3536 (class 0 OID 0)
-- Dependencies: 214
-- Name: statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gaming_marketplace_db_user
--

SELECT pg_catalog.setval('public.statuses_id_seq', 1, false);


--
-- TOC entry 3537 (class 0 OID 0)
-- Dependencies: 229
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gaming_marketplace_db_user
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 3303 (class 2606 OID 39438)
-- Name: administrators administrators_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.administrators
    ADD CONSTRAINT administrators_pkey PRIMARY KEY (id);


--
-- TOC entry 3307 (class 2606 OID 39460)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- TOC entry 3293 (class 2606 OID 39373)
-- Name: characteristic_games characteristic_games_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.characteristic_games
    ADD CONSTRAINT characteristic_games_pkey PRIMARY KEY (game_id, characteristic_id);


--
-- TOC entry 3279 (class 2606 OID 39319)
-- Name: characteristics characteristics_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.characteristics
    ADD CONSTRAINT characteristics_pkey PRIMARY KEY (id);


--
-- TOC entry 3313 (class 2606 OID 41505)
-- Name: customer_products customer_products_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.customer_products
    ADD CONSTRAINT customer_products_pkey PRIMARY KEY (key_id);


--
-- TOC entry 3299 (class 2606 OID 39418)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 3295 (class 2606 OID 39388)
-- Name: game_genres game_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.game_genres
    ADD CONSTRAINT game_genres_pkey PRIMARY KEY (game_id, genre_id);


--
-- TOC entry 3297 (class 2606 OID 39403)
-- Name: game_platforms game_platforms_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.game_platforms
    ADD CONSTRAINT game_platforms_pkey PRIMARY KEY (game_id, platform_id);


--
-- TOC entry 3283 (class 2606 OID 39335)
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- TOC entry 3281 (class 2606 OID 39326)
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- TOC entry 3311 (class 2606 OID 41493)
-- Name: keys keys_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.keys
    ADD CONSTRAINT keys_pkey PRIMARY KEY (id);


--
-- TOC entry 3285 (class 2606 OID 39345)
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (role_id, url);


--
-- TOC entry 3277 (class 2606 OID 39310)
-- Name: platforms platforms_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.platforms
    ADD CONSTRAINT platforms_pkey PRIMARY KEY (id);


--
-- TOC entry 3309 (class 2606 OID 41464)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3273 (class 2606 OID 39296)
-- Name: publishers publishers_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.publishers
    ADD CONSTRAINT publishers_pkey PRIMARY KEY (id);


--
-- TOC entry 3305 (class 2606 OID 39448)
-- Name: recoveries recoveries_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.recoveries
    ADD CONSTRAINT recoveries_pkey PRIMARY KEY (code);


--
-- TOC entry 3275 (class 2606 OID 39303)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3301 (class 2606 OID 39428)
-- Name: salesmans salesmans_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.salesmans
    ADD CONSTRAINT salesmans_pkey PRIMARY KEY (id);


--
-- TOC entry 3271 (class 2606 OID 39289)
-- Name: statuses statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_pkey PRIMARY KEY (id);


--
-- TOC entry 3287 (class 2606 OID 39363)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3289 (class 2606 OID 39361)
-- Name: users users_nickname_key; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_nickname_key UNIQUE (nickname);


--
-- TOC entry 3291 (class 2606 OID 39359)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3325 (class 2606 OID 39439)
-- Name: administrators administrators_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.administrators
    ADD CONSTRAINT administrators_id_fkey FOREIGN KEY (id) REFERENCES public.users(id);


--
-- TOC entry 3327 (class 2606 OID 39461)
-- Name: applications applications_salesman_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_salesman_id_fkey FOREIGN KEY (salesman_id) REFERENCES public.salesmans(id);


--
-- TOC entry 3317 (class 2606 OID 39379)
-- Name: characteristic_games characteristic_games_characteristic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.characteristic_games
    ADD CONSTRAINT characteristic_games_characteristic_id_fkey FOREIGN KEY (characteristic_id) REFERENCES public.characteristics(id);


--
-- TOC entry 3318 (class 2606 OID 39374)
-- Name: characteristic_games characteristic_games_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.characteristic_games
    ADD CONSTRAINT characteristic_games_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id);


--
-- TOC entry 3333 (class 2606 OID 41511)
-- Name: customer_products customer_products_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.customer_products
    ADD CONSTRAINT customer_products_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- TOC entry 3334 (class 2606 OID 41516)
-- Name: customer_products customer_products_customer_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.customer_products
    ADD CONSTRAINT customer_products_customer_status_id_fkey FOREIGN KEY (customer_status_id) REFERENCES public.statuses(id);


--
-- TOC entry 3335 (class 2606 OID 41506)
-- Name: customer_products customer_products_key_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.customer_products
    ADD CONSTRAINT customer_products_key_id_fkey FOREIGN KEY (key_id) REFERENCES public.keys(id);


--
-- TOC entry 3323 (class 2606 OID 39419)
-- Name: customers customers_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_id_fkey FOREIGN KEY (id) REFERENCES public.users(id);


--
-- TOC entry 3319 (class 2606 OID 39389)
-- Name: game_genres game_genres_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.game_genres
    ADD CONSTRAINT game_genres_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id);


--
-- TOC entry 3320 (class 2606 OID 39394)
-- Name: game_genres game_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.game_genres
    ADD CONSTRAINT game_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id);


--
-- TOC entry 3321 (class 2606 OID 39404)
-- Name: game_platforms game_platforms_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.game_platforms
    ADD CONSTRAINT game_platforms_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id);


--
-- TOC entry 3322 (class 2606 OID 39409)
-- Name: game_platforms game_platforms_platform_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.game_platforms
    ADD CONSTRAINT game_platforms_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id);


--
-- TOC entry 3314 (class 2606 OID 39336)
-- Name: games games_publisher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_publisher_id_fkey FOREIGN KEY (publisher_id) REFERENCES public.publishers(id);


--
-- TOC entry 3332 (class 2606 OID 41494)
-- Name: keys keys_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.keys
    ADD CONSTRAINT keys_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3315 (class 2606 OID 39346)
-- Name: permissions permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 3328 (class 2606 OID 41465)
-- Name: products products_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id);


--
-- TOC entry 3329 (class 2606 OID 41480)
-- Name: products products_platform_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id);


--
-- TOC entry 3330 (class 2606 OID 41475)
-- Name: products products_product_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_product_status_id_fkey FOREIGN KEY (product_status_id) REFERENCES public.statuses(id);


--
-- TOC entry 3331 (class 2606 OID 41470)
-- Name: products products_salesman_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_salesman_id_fkey FOREIGN KEY (salesman_id) REFERENCES public.salesmans(id);


--
-- TOC entry 3326 (class 2606 OID 39449)
-- Name: recoveries recoveries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.recoveries
    ADD CONSTRAINT recoveries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3324 (class 2606 OID 39429)
-- Name: salesmans salesmans_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.salesmans
    ADD CONSTRAINT salesmans_id_fkey FOREIGN KEY (id) REFERENCES public.users(id);


--
-- TOC entry 3316 (class 2606 OID 39364)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gaming_marketplace_db_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: gaming_marketplace_db_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2024-06-02 14:44:01

--
-- gaming_marketplace_db_userQL database dump complete
--


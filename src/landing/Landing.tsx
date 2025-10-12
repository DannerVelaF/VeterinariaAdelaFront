import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bath,
  Clock,
  Mail,
  MapPinPlusInside,
  Phone,
  Sparkles,
  Star,
  Wind,
  ChevronDown,
} from 'lucide-react';
import Logo from '../assets/images/logo.jpg';
import bgImage from '../assets/images/bg_1.jpg.webp';
import { useNavigate } from 'react-router';
// Datos de productos simulados
const listaProductos = [
  {
    nombre: 'Alimento Premium',
    categoria: 'Alimentos',
    src: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop',
  },
  {
    nombre: 'Snacks Naturales',
    categoria: 'Alimentos',
    src: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
  },
  {
    nombre: 'Collar Antipulgas',
    categoria: 'Accesorios',
    src: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop',
  },
  {
    nombre: 'Juguete Interactivo',
    categoria: 'Juguetes',
    src: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400&h=400&fit=crop',
  },
  {
    nombre: 'Cama Ortopédica',
    categoria: 'Accesorios',
    src: 'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400&h=400&fit=crop',
  },
  {
    nombre: 'Shampoo Medicado',
    categoria: 'Higiene',
    src: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
  },
];

function Landing() {
  const [showMenu, setShowMenu] = useState(false);
  const [mostrarMapa, setMostrarMapa] = useState(false);

  // Animaciones variantes
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const fadeInDown = {
    initial: { opacity: 0, y: -60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5 },
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  };

  const slideInRight = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  };

  const navigate = useNavigate();

  return (
    <div className="relative w-full font-sans text-gray-800 overflow-x-hidden">
      {/* NAVBAR DESKTOP */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 w-[70%] z-50 items-center justify-between px-8 py-4 rounded-full bg-white/80 backdrop-blur-xl shadow-2xl border border-white/60"
      >
        <motion.p
          whileHover={{ scale: 1.05 }}
          className="text-[#fd4c82] font-extrabold text-2xl tracking-tight"
        >
          Adela <span className="text-gray-700 text-xl">Veterinaria & Spa</span>
        </motion.p>
        <ul className="flex gap-8 text-base font-medium">
          {[
            'Inicio',
            'Sobre nosotros',
            'Productos',
            'Servicios',
            'Contacto',
          ].map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ y: -2, color: '#fd4c82' }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer"
            >
              <a href={`#${item.toLowerCase().replace(' ', '-')}`}>{item}</a>
            </motion.li>
          ))}
        </ul>
      </motion.nav>

      {/* NAVBAR MOBILE */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="md:hidden fixed top-0 left-0 w-full z-50 flex items-center justify-between p-5 bg-white/90 backdrop-blur-lg shadow-lg"
      >
        <p className="text-[#fd4c82] font-bold text-xl">Veterinaria Adela</p>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowMenu(!showMenu)}
          className="text-3xl"
        >
          <i className={`pi ${showMenu ? 'pi-times' : 'pi-bars'}`}></i>
        </motion.button>
      </motion.div>

      {/* MENÚ DESPLEGABLE MOBILE */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-[70px] w-full z-40 bg-white/95 backdrop-blur-lg shadow-xl"
          >
            <div className="p-6 flex flex-col gap-4">
              {[
                'Inicio',
                'Sobre nosotros',
                'Productos',
                'Servicios',
                'Contacto',
              ].map((item, index) => (
                <motion.a
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-lg font-medium hover:text-[#fd4c82] transition py-2 border-b border-gray-100"
                  onClick={() => setShowMenu(false)}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <main
        id="inicio"
        style={{ backgroundImage: `url(${bgImage})` }}
        className="relative min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/10"></div>
        {/* Elementos decorativos animados */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 right-20 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"
        />

        <div className="relative z-10 text-center max-w-4xl px-6 py-32 md:py-0">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-6xl md:text-7xl font-black mb-6 leading-tight bg-gradient-to-r from-[#fd4c82] via-purple-500 to-blue-500 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              El cuidado que tu mascota merece
            </motion.h1>
          </motion.div>

          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl mb-12 text-gray-700 leading-relaxed font-medium"
          >
            Velamos por la salud y bienestar de tu mascota con servicios
            especializados y llenos de cariño
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(253, 76, 130, 0.4)',
              }}
              onClick={() => navigate('/login')}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#fd4c82] to-[#e63b6f] text-white font-bold px-10 py-4 rounded-full shadow-xl"
            >
              Separar una cita
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#sobre-nosotros"
              className="border-2 border-[#fd4c82] text-[#fd4c82] hover:bg-[#fd4c82] hover:text-white font-semibold px-10 py-4 rounded-full transition"
            >
              Conocer más
            </motion.a>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-16"
          >
            <ChevronDown size={40} className="text-[#fd4c82] mx-auto" />
          </motion.div>
        </div>
      </main>

      {/* CARDS SERVICIOS */}
      <section className="py-20 w-[85%] lg:w-[70%] mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: 'pi-heart',
              title: 'Cuidado y Estética',
              desc: 'Cortes de pelo, limpieza dental y tratamientos de belleza para tus mascotas.',
            },
            {
              icon: 'pi-plus',
              title: 'Tratamientos Especiales',
              desc: 'Desparasitación, baños medicados y terapias de hidratación profunda.',
            },
            {
              icon: 'pi-shield',
              title: 'Vacunación y Control',
              desc: 'Programas de vacunación y chequeos regulares para garantizar su salud.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{
                y: -10,
                boxShadow: '0 25px 50px rgba(253, 76, 130, 0.3)',
              }}
              className="group h-auto bg-white rounded-3xl p-8 flex flex-col gap-4 shadow-xl border border-gray-100 cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl h-16 w-16 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shadow-lg"
              >
                <i className={`pi ${item.icon} text-[#fd4c82] text-3xl`} />
              </motion.div>
              <h3 className="font-bold text-2xl">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section id="sobre-nosotros" className="py-24 w-[85%] lg:w-[70%] mx-auto">
        <div className="flex md:flex-row flex-col items-center gap-16">
          <motion.div
            {...slideInLeft}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
            className="flex-1"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&h=600&fit=crop"
                alt="Veterinaria"
                className="w-full h-[500px] object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div
            {...slideInRight}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
            className="flex-1 space-y-6"
          >
            <motion.p
              className="text-[#fd4c82] font-bold text-3xl"
              whileHover={{ scale: 1.05 }}
            >
              Veterinaria Adela
            </motion.p>
            <h2 className="font-black text-5xl leading-tight">
              Tu mejor opción para el cuidado de tu mascota
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Sabemos que tu mascota es un miembro invaluable de tu familia. Por
              eso, nos esforzamos por ofrecer el mejor cuidado posible, adaptado
              a sus necesidades únicas.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#fd4c82] text-white px-8 py-4 rounded-full font-bold shadow-xl"
            >
              Conocer nuestro equipo
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section
        id="productos"
        className="py-24 bg-gradient-to-b from-pink-50 to-white"
      >
        <div className="w-[85%] lg:w-[70%] mx-auto">
          <motion.div
            {...fadeInDown}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
            className="text-center mb-16"
          >
            <h2 className="font-black text-6xl mb-6">Productos de calidad</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Seleccionamos cuidadosamente cada producto para garantizar la
              salud y felicidad de tu mascota
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {listaProductos.slice(0, 6).map((producto, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -15, scale: 1.03 }}
                className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 cursor-pointer"
              >
                <div className="overflow-hidden rounded-2xl mb-4">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    src={producto.src}
                    alt={producto.nombre}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <span className="text-[#fd4c82] font-bold text-sm uppercase tracking-wide">
                  {producto.categoria}
                </span>
                <p className="text-gray-800 font-semibold text-lg mt-2">
                  {producto.nombre}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            {...fadeInUp}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#fd4c82] text-white px-10 py-4 rounded-full font-bold shadow-xl"
              onClick={() => navigate('/login')}
            >
              Ver todos los productos
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* SERVICIOS VETERINARIOS */}
      <section id="servicios" className="py-24 w-[85%] lg:w-[70%] mx-auto">
        <motion.div
          {...fadeInDown}
          viewport={{ once: true }}
          whileInView="animate"
          initial="initial"
          className="text-center mb-16"
        >
          <h2 className="font-black text-6xl mb-6">Servicios veterinarios</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ofrecemos atención médica integral con los más altos estándares de
            calidad
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {[
            {
              text: 'Consulta veterinaria',
              description:
                'Atención médica profesional con veterinarios certificados.',
              icon: 'pi-user',
            },
            {
              text: 'Vacunación y prevención',
              description:
                'Programas completos de vacunación y medicina preventiva.',
              icon: 'pi-shield',
            },
            {
              text: 'Cirugías especializadas',
              description: 'Quirófano equipado con tecnología de punta.',
              icon: 'pi-heart',
            },
            {
              text: 'Urgencias 24/7',
              description: 'Atención de emergencia disponible las 24 horas.',
              icon: 'pi-clock',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{
                y: -10,
                boxShadow: '0 25px 50px rgba(253, 76, 130, 0.3)',
              }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl h-16 w-16 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shadow-lg mb-4"
              >
                <i className={`pi ${item.icon} text-[#fd4c82] text-3xl`}></i>
              </motion.div>
              <h3 className="font-bold text-2xl mb-3">{item.text}</h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SPA & ESTÉTICA */}
      <section className="py-24 bg-gradient-to-b from-white to-pink-50">
        <div className="w-[85%] lg:w-[70%] mx-auto flex md:flex-row flex-col items-center gap-16">
          <motion.div
            {...slideInLeft}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
            className="flex-1"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=700&h=500&fit=crop"
                alt="Spa"
                className="w-full h-[500px] object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div
            {...slideInRight}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
            className="flex-1 space-y-8"
          >
            <h2 className="font-black text-5xl">Spa & Estética</h2>
            <p className="text-lg text-gray-600">
              Un espacio diseñado para el confort y la belleza de tu mascota.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  Icon: Bath,
                  title: 'Baño premium',
                  desc: 'Productos hipoalergénicos de alta calidad.',
                },
                {
                  Icon: Sparkles,
                  title: 'Estética Canina',
                  desc: 'Cortes y peinados profesionales.',
                },
                {
                  Icon: Star,
                  title: 'Tratamientos Especiales',
                  desc: 'Los mejores tratamientos.',
                },
                {
                  Icon: Wind,
                  title: 'Aromaterapia',
                  desc: 'Relajación máxima.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 10 }}
                  className="flex gap-4 items-start"
                >
                  <div className="bg-[#fd4c82]/20 rounded-2xl p-3 shrink-0">
                    <item.Icon className="text-[#fd4c82]" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{item.title}</p>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#fd4c82] text-white px-8 py-4 rounded-full font-bold shadow-xl"
            >
              Reservar Cita
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-24 w-[85%] lg:w-[70%] mx-auto">
        <motion.div
          {...fadeInDown}
          viewport={{ once: true }}
          whileInView="animate"
          initial="initial"
          className="text-center mb-16"
        >
          <h2 className="font-black text-6xl mb-6">Visítanos</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para cuidar de tu mascota. Contáctanos o visítanos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            {...slideInLeft}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
          >
            <AnimatePresence mode="wait">
              {!mostrarMapa ? (
                <motion.div
                  key="info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {[
                    {
                      Icon: MapPinPlusInside,
                      title: 'Dirección',
                      content: 'Av. Principal 123, Ciudad',
                    },
                    { Icon: Phone, title: 'Teléfono', content: '987654321' },
                    {
                      Icon: Mail,
                      title: 'Contacto',
                      content: 'adela@veterinaria.com',
                    },
                    {
                      Icon: Clock,
                      title: 'Horario',
                      content: 'Lun-Vie: 8:00-20:00',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 10 }}
                      className="flex gap-4 items-start"
                    >
                      <div className="bg-[#fd4c82]/20 rounded-2xl p-3 shrink-0">
                        <item.Icon className="text-[#fd4c82]" size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{item.title}</p>
                        <p className="text-gray-600">{item.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMostrarMapa(true)}
                    className="w-full bg-[#fd4c82] text-white py-3 rounded-full font-bold"
                  >
                    Ver mapa
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-4">
                    <iframe
                      title="Mapa"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.0!2d-77.0!3d-12.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                    ></iframe>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMostrarMapa(false)}
                    className="w-full bg-gray-700 text-white py-3 rounded-full font-bold"
                  >
                    Ver información
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            {...slideInRight}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
          >
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Nombre</label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#fd4c82] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Teléfono</label>
                  <input
                    type="text"
                    placeholder="Tu teléfono"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#fd4c82] outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Tu email"
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#fd4c82] outline-none transition"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">
                  Nombre de tu mascota
                </label>
                <input
                  type="text"
                  placeholder="Tu mascota"
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#fd4c82] outline-none transition"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Mensaje</label>
                <textarea
                  placeholder="Tu mensaje"
                  rows={6}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#fd4c82] outline-none resize-none transition"
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-[#fd4c82] text-white py-4 rounded-full font-bold shadow-xl"
              >
                Enviar Mensaje
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-b from-gray-100 to-gray-200 py-20">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="w-[85%] lg:w-[70%] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#fd4c82] to-purple-500 rounded-full flex items-center justify-center shadow-xl">
              <img src={Logo} alt="Logo" className="w-16 h-16 rounded-full" />
            </div>
            <p className="text-gray-700 leading-relaxed">
              Al cuidado de tu mascota, un integrante más de tu familia.
            </p>
            <div className="flex gap-3">
              {['facebook', 'instagram'].map((social, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="w-10 h-10 bg-[#fd4c82]/20 rounded-full flex items-center justify-center hover:bg-[#fd4c82] hover:text-white transition-colors"
                >
                  <i className={`pi pi-${social}`}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-4">
            <h3 className="font-bold text-xl border-b-4 border-[#fd4c82] inline-block pb-2">
              Servicios
            </h3>
            <ul className="space-y-2">
              {[
                'Baños',
                'Desparasitación',
                'Tratamientos',
                'Alimentos',
                'Especialidades',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 10, color: '#fd4c82' }}
                  className="cursor-pointer text-gray-700 transition"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-4">
            <h3 className="font-bold text-xl border-b-4 border-[#fd4c82] inline-block pb-2">
              Enlaces
            </h3>
            <ul className="space-y-2">
              {[
                { name: 'Inicio', href: '#inicio' },
                { name: 'Nosotros', href: '#sobre-nosotros' },
                { name: 'Productos', href: '#productos' },
                { name: 'Servicios', href: '#servicios' },
                { name: 'Contacto', href: '#contacto' },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 10, color: '#fd4c82' }}
                  className="cursor-pointer text-gray-700 transition"
                >
                  <a href={item.href}>{item.name}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-4">
            <h3 className="font-bold text-xl border-b-4 border-[#fd4c82] inline-block pb-2">
              Síguenos
            </h3>
            <ul className="space-y-2">
              {['Facebook', 'Instagram', 'Youtube', 'Twitter'].map(
                (item, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ x: 10, color: '#fd4c82' }}
                    className="cursor-pointer text-gray-700 transition"
                  >
                    {item}
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-[85%] lg:w-[70%] mx-auto mt-12 pt-8 border-t-2 border-gray-300"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600">
            <p>© 2025 Veterinaria Adela. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <motion.a
                whileHover={{ y: -2, color: '#fd4c82' }}
                href="#"
                className="hover:underline"
              >
                Términos y Condiciones
              </motion.a>
              <motion.a
                whileHover={{ y: -2, color: '#fd4c82' }}
                href="#"
                className="hover:underline"
              >
                Política de Privacidad
              </motion.a>
            </div>
          </div>
        </motion.div>
      </footer>

      {/* BOTÓN FLOTANTE WHATSAPP */}
      <motion.a
        href="https://wa.me/987654321"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 360 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.6 }}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/50 transition-all"
      >
        <i className="pi pi-whatsapp text-white text-3xl"></i>
      </motion.a>

      {/* SCROLL TO TOP */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 left-8 z-50 w-14 h-14 bg-[#fd4c82] rounded-full flex items-center justify-center shadow-2xl hover:shadow-pink-500/50 transition-all"
      >
        <i className="pi pi-arrow-up text-white text-2xl"></i>
      </motion.button>
    </div>
  );
}

export default Landing;

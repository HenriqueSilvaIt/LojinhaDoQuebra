import './style.css';
import imgInsta from '../../assets/instagram-logo.png';
import facebook from '../../assets/social-media.png';
import youtube from '../../assets/youtube (1).png';
import whats from '../../assets/whatsapp.png';

export default function FooterQuebra() {
    return (
        <footer>
            <div className= "dsc-container footer-content"> 
            <div className="dsc-logo">
            <h4>Lojinha do quebra</h4>
                <p>CNPJ: 17.319.752/0001-12 </p>
            </div>

            <div className="dsc-street">
                <h4>Endereço:</h4>
                <p>R. Bougival, 159 - Jardim Ipanema, Santo André - SP, 09130-090</p>
            </div>
            <div className="dsc-socialmedias">
                <h4>Redes Sociais</h4>
                <a href="https://www.instagram.com/lojinha_do_quebra?igsh=MXcwdnRvYTZicm9uNA==" target="_blank"><img src={imgInsta} alt="Instagram"/></a>
                <a href="https://www.facebook.com/lojinhadoquebra" target='_blank'><img src={facebook} alt="Facebook"/></a>
                <a href="https://api.whatsapp.com/send?phone=5511992643264&text=Ol%C3%A1%20Lojinha%20do%20quebra%2C%20%0A%0ATenho%20interesse%20em%20um%20produto%20%F0%9F%98%80" target="_blank"><img src={whats} alt="whatsapp"/></a>
                <a href="https://www.youtube.com/@atsdoces9430" target="_blank"><img src={youtube} alt="Youtube"/></a>
            </div>
            </div>
        </footer>
    );
}
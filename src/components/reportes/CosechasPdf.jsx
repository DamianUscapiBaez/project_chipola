import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import Logo from '../../assets/logo.png';

export const CosechasPdf = ({ cosechaSearch, sala1, sala2, sala3, sala4, sala5, sala6, sala7, sala8, sala9, sala10, sala11, sala12, cosechaCosechadora, cosechadoraCosecha }) => {
    const styles = StyleSheet.create({
        body: {
            paddingTop: 20,
            paddingBottom: 50,
            paddingHorizontal: 20,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold'
        },
        author: {
            fontSize: 12,
            textAlign: 'center',
            marginBottom: 40,
        },
        subtitle: {
            fontSize: 18,
            margin: 12,
            fontFamily: 'Oswald'
        },
        text: {
            margin: 12,
            fontSize: 14,
            textAlign: 'justify',
            fontFamily: 'Times-Roman'
        },
        image: {
            marginVertical: 10,
            marginHorizontal: 50,
            width: '45px',
            height: '45px'
        },
        header: {
            fontSize: 12,
            marginBottom: 20,
            textAlign: 'center',
            color: 'grey',
        },
        pageNumber: {
            position: 'absolute',
            fontSize: 8,
            bottom: 30,
            left: 0,
            right: 40,
            textAlign: 'right',
            color: 'grey',
        },
    });
    const estilosTablaPdf = { padding: "4px 0" };
    const salasData = [sala1, sala2, sala3, sala4, sala5, sala6, sala7, sala8, sala9, sala10, sala11, sala12];
    // ...
    const startDate = new Date(cosechaSearch.fechainicio);
    const endDate = new Date(cosechaSearch.fechafinal);

    // Calcular la diferencia en días
    const ONE_DAY_MS = 24 * 60 * 60 * 1000; // Milisegundos en un día
    const durationInDays = Math.ceil((endDate - startDate) / ONE_DAY_MS);

    const pageSize = durationInDays <= 15 ? 'A4' : 'A3';
    
    return (
        <Document>
            {
                cosechaSearch.cosechadora === 0 &&
                <>
                    <Page style={styles.body} orientation="landscape" size={pageSize}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} fixed>
                            <View>
                                <Image style={{ width: '60px', height: '60px' }} src={Logo} />
                            </View>
                            <View style={{ marginLeft: '20px' }}>
                                <Text style={{ fontSize: '16px' }}>CHIPOLA</Text>
                            </View>
                            <View style={{ marginLeft: 'auto' }}>
                                <Text style={{ fontSize: '16px' }}>
                                    REPORTE DE COSECHAS POR FECHA
                                </Text>
                                <Text style={{ fontSize: '12px', marginLeft: 'auto', marginTop: '5px' }}>
                                    {cosechaSearch.fechainicio.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')} - {cosechaSearch.fechafinal.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}
                                </Text>
                            </View>
                        </View>
                        {salasData.map((sala, index) => (
                            sala.length > 0 && (
                                <View key={index}>
                                    <View>
                                        <Text style={{ fontSize: '12px', marginTop: '10px', marginBottom: '10px' }}>SALA {index + 1}</Text>
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', color: '#fff', backgroundColor: "#2a8038", paddingTop: '5px', paddingBottom: '5px' }}>
                                        <View style={{ display: 1, width: '5px', margin: '2px' }}>
                                            <Text style={{ fontSize: '7.5px' }}></Text>
                                        </View>
                                        <View style={{ display: 2, width: '350px', margin: '2px' }}>
                                            <Text style={{ fontSize: '7.5px' }}>NOMBRE</Text>
                                        </View>
                                        {Object.keys(sala[0])
                                            .filter((key) => key !== 'nombre' && key !== 'total')
                                            .map((key, subIndex) => (
                                                <View style={{ display: 3, width: '120px', margin: '2px' }} key={subIndex}>
                                                    <Text style={{ fontSize: '7.5px', textAlign: 'right' }}> DIA {subIndex + 1}</Text>
                                                </View>
                                            ))}
                                        <View style={{ display: 4, width: '120px', margin: '2px' }}>
                                            <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>TOTAL</Text>
                                        </View>
                                        <View style={{ display: 5, width: '5px', margin: '2px' }}>
                                            <Text style={{ fontSize: '7.5px' }}></Text>
                                        </View>
                                    </View>
                                    {sala.map((row, subIndex) => (
                                        <View key={subIndex} style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#EBF8FF', padding: estilosTablaPdf.padding }}>
                                            <View style={{ display: 1, width: '5px', margin: '2px' }}>
                                                <Text style={{ fontSize: '7.5px' }}></Text>
                                            </View>
                                            <View style={{ display: 2, width: '350px', margin: '2px' }}>
                                                <Text style={{ fontSize: '8pt' }}>{row.nombre}</Text>
                                            </View>
                                            {Object.keys(row).map((key) => {
                                                if (key !== 'nombre' && key !== 'total') {
                                                    return (
                                                        <View key={key} style={{ display: 3, width: '120px', margin: '2px' }}>
                                                            <Text style={{ fontSize: '8pt', textAlign: 'right' }}>{row[key]}</Text>
                                                        </View>
                                                    );
                                                }
                                                return null;
                                            })}
                                            <View style={{ display: 4, width: '120px', margin: '2px' }}>
                                                <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{row.total}</Text>
                                            </View>
                                            <View style={{ display: 5, width: '5px', margin: '2px' }}>
                                                <Text style={{ fontSize: '7.5px' }}></Text>
                                            </View>
                                            <br />
                                        </View>
                                    ))}
                                    <View style={{ display: 'flex', flexDirection: 'row', color: '#fff', backgroundColor: "#2a8038", padding: "4px 0" }}>
                                        <View style={{ display: 1, width: '5px', margin: '2px' }}>
                                            <Text style={{ fontSize: '7.5px' }}></Text>
                                        </View>
                                        <View style={{ display: 2, width: '350px', margin: '2px' }}>
                                            <Text style={{ fontSize: '8pt' }}>TOTAL</Text>
                                        </View>
                                        {Object.keys(sala[0])
                                            .filter((key) => key !== 'nombre' && key !== 'total')
                                            .map((key) => (
                                                <View key={key} style={{ display: 3, width: '120px', margin: '2px' }}>
                                                    <Text style={{ fontSize: '8pt', textAlign: 'right' }}>
                                                        {sala.reduce((total, item) => parseFloat(total) + parseFloat(item[key]), 0).toFixed(3)}
                                                    </Text>
                                                </View>
                                            ))}
                                        <View style={{ display: 4, width: '120px', margin: '2px' }}>
                                            <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>
                                                {sala.reduce((total, item) => parseFloat(total) + parseFloat(item.total), 0).toFixed(3)}
                                            </Text>
                                        </View>
                                        <View style={{ display: 5, width: '5px', margin: '2px' }}>
                                            <Text style={{ fontSize: '7.5px' }}></Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        ))}
                        <Text style={{ fontSize: 8, left: 40, right: 0, textAlign: 'left', bottom: 30, position: 'absolute', color: 'grey', }} fixed>Fecha: {new Date().toLocaleDateString('es-ES')}</Text>
                        <Text style={{ fontSize: 8, left: 130, right: 0, textAlign: 'left', bottom: 30, position: 'absolute', color: 'grey', }} fixed>Hora: {new Date().toLocaleTimeString()}</Text>
                        <Text style={styles.pageNumber} render={({ pageNumber }) => (
                            `Pag ${pageNumber}`
                        )} fixed />
                    </Page>
                    <Page style={styles.body} orientation="landscape">
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px' }} fixed>
                            <View>
                                <Image style={{ width: '60px', height: '60px' }} src={Logo} />
                            </View>
                            <View style={{ marginLeft: '20px' }}>
                                <Text style={{ fontSize: '16px' }}>CHIPOLA</Text>
                            </View>
                            <View style={{ marginLeft: 'auto' }}>
                                <Text style={{ fontSize: '16px' }}>
                                    REPORTE DE COSECHAS POR COSECHADORA
                                </Text>
                                <Text style={{ fontSize: '12px', marginLeft: 'auto', marginTop: '5px' }}>
                                    {cosechaSearch.fechainicio.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')} - {cosechaSearch.fechafinal.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}
                                </Text>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', color: '#fff', backgroundColor: "#2a8038", paddingTop: "5px", paddingBottom: '5px', width: '400px' }} fixed>
                            <View style={{ display: 1, width: '5px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}></Text>
                            </View>
                            <View style={{ display: 2, width: '300px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}>COSECHADORA</Text>
                            </View>
                            <View style={{ display: 3, width: '100px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}>PESO</Text>
                            </View>
                            <View style={{ display: 4, width: '5px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}></Text>
                            </View>
                        </View>
                        {
                            cosechaCosechadora.map((c, index) => (
                                <View key={index} style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#EBF8FF', padding: estilosTablaPdf.padding, width: '400px' }}>
                                    <View style={{ display: 1, width: '5px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}></Text>
                                    </View>
                                    <View style={{ display: 2, width: '300px', margin: '2px' }}>
                                        <Text style={{ fontSize: '8pt' }}>{c.nombre}</Text>
                                    </View>
                                    <View style={{ display: 3, width: '100px', margin: '2px' }}>
                                        <Text style={{ fontSize: '8pt' }}>{c.totalpeso}</Text>
                                    </View>
                                    <View style={{ display: 4, width: '5px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}></Text>
                                    </View>
                                    <br />
                                </View>
                            ))
                        }
                        <View style={{ display: 'flex', flexDirection: 'row', color: '#fff', backgroundColor: "#2a8038", paddingTop: "5px", paddingBottom: '5px', width: '400px' }}>
                            <View style={{ display: 1, width: '5px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}></Text>
                            </View>
                            <View style={{ display: 2, width: '300px', margin: '2px' }}>
                                <Text style={{ fontSize: '8pt' }}>TOTAL</Text>
                            </View>
                            <View style={{ display: 3, width: '100px', margin: '2px' }}>
                                <Text style={{ fontSize: '8pt' }}>{cosechaCosechadora.reduce((total, item) => parseFloat(total) + parseFloat(item.totalpeso), 0).toFixed(3)}</Text>
                            </View>
                            <View style={{ display: 4, width: '5px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}></Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 8, left: 40, right: 0, textAlign: 'left', bottom: 30, position: 'absolute', color: 'grey', }} fixed>Fecha: {new Date().toLocaleDateString('es-ES')}</Text>
                        <Text style={{ fontSize: 8, left: 130, right: 0, textAlign: 'left', bottom: 30, position: 'absolute', color: 'grey', }} fixed>Hora: {new Date().toLocaleTimeString()}</Text>
                        <Text style={styles.pageNumber} render={({ pageNumber }) => (
                            `Pag ${pageNumber}`
                        )} fixed />
                    </Page>
                </>
            }
            {
                cosechaSearch.cosechadora > 0 &&
                <Page style={styles.body} orientation="landscape">
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} fixed>
                        <View>
                            <Image style={{ width: '60px', height: '60px' }} src={Logo} />
                        </View>
                        <View style={{ marginLeft: '20px' }}>
                            <Text style={{ fontSize: '16px' }}>CHIPOLA</Text>
                        </View>
                        <View style={{ marginLeft: 'auto' }}>
                            <Text style={{ fontSize: '16px' }}>
                                REPORTE DE COSECHAS POR COSECHADORA
                            </Text>
                            <Text style={{ fontSize: '12px', marginLeft: 'auto', marginTop: '5px' }}>
                                {cosechaSearch.fechainicio.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')} - {cosechaSearch.fechafinal.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}
                            </Text>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', color: '#fff', backgroundColor: "#2a8038", paddingTop: "5px", paddingBottom: '5px' }} fixed>
                        <View style={{ display: 1, width: '5px', margin: '2px' }}>
                            <Text style={{ fontSize: '7.5px' }}></Text>
                        </View>
                        <View style={{ display: 2, width: '100px', margin: '2px' }}>
                            <Text style={{ fontSize: '7.5px' }}>FECHA</Text>
                        </View>
                        <View style={{ display: 2, width: '300px', margin: '2px' }}>
                            <Text style={{ fontSize: '7.5px' }}>COSECHADORA</Text>
                        </View>
                        <View style={{ display: 3, width: '100px', margin: '2px' }}>
                            <Text style={{ fontSize: '7.5px' }}>SALA</Text>
                        </View>
                        <View style={{ display: 4, width: '150px', margin: '2px' }}>
                            <Text style={{ fontSize: '7.5px' }}>PESO</Text>
                        </View>
                        <View style={{ display: 5, width: '150px', margin: '2px' }}>
                            <Text style={{ fontSize: '7.5px' }}>DESCARTE</Text>
                        </View>
                        <View style={{ display: 6, width: '5px', margin: '2px' }}>
                            <Text style={{ fontSize: '7.5px' }}></Text>
                        </View>
                    </View>
                    {
                        cosechadoraCosecha.map((data, index) => (
                            <View key={index} style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#EBF8FF', padding: estilosTablaPdf.padding }}>
                                <View style={{ display: 1, width: '5px', margin: '2px' }}>
                                    <Text style={{ fontSize: '7.5px' }}></Text>
                                </View>
                                <View style={{ display: 2, width: '100px', margin: '2px' }}>
                                    <Text style={{ fontSize: '7.5px' }}>{data.fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}</Text>
                                </View>
                                <View style={{ display: 3, width: '300px', margin: '2px' }}>
                                    <Text style={{ fontSize: '7.5px' }}>{data.cosechadora}</Text>
                                </View>
                                <View style={{ display: 4, width: '100px', margin: '2px' }}>
                                    <Text style={{ fontSize: '7.5px' }}>{data.sala}</Text>
                                </View>
                                <View style={{ display: 5, width: '150px', margin: '2px' }}>
                                    <Text style={{ fontSize: '7.5px' }}>{data.peso}</Text>
                                </View>
                                <View style={{ display: 6, width: '150px', margin: '2px' }}>
                                    <Text style={{ fontSize: '7.5px' }}>{data.descarte}</Text>
                                </View>
                                <View style={{ display: 7, width: '5px', margin: '2px' }}>
                                    <Text style={{ fontSize: '7.5px' }}></Text>
                                </View>
                                <br />
                            </View>
                        ))
                    }
                    <View style={{ display: 'flex', flexDirection: 'row', color: '#fff', backgroundColor: "#2a8038", padding: "4px 0" }}>
                        <View style={{ display: 1, width: '5px', margin: '2px' }}>
                            <Text style={{ fontSize: '7.5px' }}></Text>
                        </View>
                        <View style={{ display: 2, width: '100px', margin: '2px' }}>
                            <Text style={{ fontSize: '7.5px' }}></Text>
                        </View>
                        <View style={{ display: 3, width: '300px', margin: '2px' }}>
                            <Text style={{ fontSize: '7.5px' }}></Text>
                        </View>
                        <View style={{ display: 4, width: '100px', margin: '2px' }}>
                            <Text style={{ fontSize: '7.5px' }}></Text>
                        </View>
                        <View style={{ display: 5, width: '150px', margin: '2px' }}>
                            <Text style={{ fontSize: '7.5px' }}>{cosechadoraCosecha.reduce((total, item) => parseFloat(total) + parseFloat(item.peso), 0).toFixed(3)}</Text>
                        </View>
                        <View style={{ display: 6, width: '150px', margin: '2px' }}>
                            <Text style={{ fontSize: '7.5px' }}>{cosechadoraCosecha.reduce((total, item) => parseFloat(total) + parseFloat(item.descarte), 0).toFixed(3)}</Text>
                        </View>
                        <View style={{ display: 7, width: '5px', margin: '2px' }}>
                            <Text style={{ fontSize: '7.5px' }}></Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 8, left: 40, right: 0, textAlign: 'left', bottom: 30, position: 'absolute', color: 'grey', }} fixed>Fecha: {new Date().toLocaleDateString('es-ES')}</Text>
                    <Text style={{ fontSize: 8, left: 130, right: 0, textAlign: 'left', bottom: 30, position: 'absolute', color: 'grey', }} fixed>Hora: {new Date().toLocaleTimeString()}</Text>
                    <Text style={styles.pageNumber} render={({ pageNumber }) => (
                        `Pag ${pageNumber}`
                    )} fixed />
                </Page>
            }
        </Document>
    );
}
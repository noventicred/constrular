import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Mail, Phone, MapPin, Eye, EyeOff, Lock } from 'lucide-react';
import { AuthRedirect } from '@/components/auth/AuthRedirect';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Formatação de campos
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatCEP = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  // Busca de endereço por CEP
  const fetchAddressByCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast({
          title: 'CEP não encontrado',
          description: 'Por favor, verifique o CEP informado.',
          variant: 'destructive',
        });
        return;
      }

      setStreet(data.logradouro || '');
      setCity(data.localidade || '');
      setState(data.uf || '');
      
      if (data.logradouro) {
        toast({
          title: 'Endereço encontrado!',
          description: 'Os campos foram preenchidos automaticamente.',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao buscar CEP',
        description: 'Tente novamente ou preencha manualmente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingCep(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Campos obrigatórios básicos
    if (!fullName.trim()) newErrors.fullName = 'Nome é obrigatório';
    if (!email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!validateEmail(email)) newErrors.email = 'Email inválido';
    if (!password.trim()) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    if (!confirmPassword.trim()) newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
    
    // Telefone obrigatório
    if (!phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    else if (phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Telefone deve ter pelo menos 10 dígitos';
    
    // Campos de endereço obrigatórios
    if (!zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório';
    else if (zipCode.replace(/\D/g, '').length !== 8) newErrors.zipCode = 'CEP deve ter 8 dígitos';
    
    if (!street.trim()) newErrors.street = 'Rua é obrigatória';
    if (!number.trim()) newErrors.number = 'Número é obrigatório';
    if (!city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!state.trim()) newErrors.state = 'Estado é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await signIn(email, password);

      if (error) {
        console.error('Auth page: login error', error);
        toast({
          title: 'Erro ao fazer login',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro inesperado',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone,
            street,
            number,
            complement,
            city,
            state,
            zip_code: zipCode,
          },
        },
      });

      if (error) {
        toast({
          title: 'Erro ao criar conta',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Conta criada com sucesso!',
          description: 'Sua conta foi criada e você já pode fazer login.',
        });
        // Reset form
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
        setStreet('');
        setNumber('');
        setComplement('');
        setCity('');
        setState('');
        setZipCode('');
      }
    } catch (error) {
      toast({
        title: 'Erro inesperado',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthRedirect />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 px-4 py-8 md:py-12">
          <div className="w-full max-w-2xl">
            <div className="mb-8">
              <nav className="text-sm text-muted-foreground">
                <span>Início</span> / <span className="text-foreground">Autenticação</span>
              </nav>
            </div>

            <Card className="shadow-2xl border-muted/20 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center space-y-6 pb-10 px-6 md:px-8 pt-8">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Bem-vindo
                  </CardTitle>
                  <CardDescription className="text-lg mt-3 max-w-md mx-auto leading-relaxed">
                    Acesse sua conta ou crie uma nova para continuar
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 md:px-8 pb-8">
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-10 h-12">
                    <TabsTrigger value="signin" className="text-sm font-medium h-10">
                      Entrar
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="text-sm font-medium h-10">
                      Criar Conta
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-8 mt-10">
                    <form onSubmit={handleSignIn} className="space-y-8">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="signin-email" className="text-sm font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </Label>
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-14 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="signin-password" className="text-sm font-medium flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Senha
                          </Label>
                          <div className="relative">
                            <Input
                              id="signin-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Sua senha"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              className="h-14 pr-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full h-14 text-base font-medium mt-8"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                      </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-8 mt-10">
                  <form onSubmit={handleSignUp} className="space-y-8">
                    {/* Informações Pessoais */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-base font-semibold text-primary border-b border-muted pb-3">
                        <User className="h-5 w-5" />
                        Informações Pessoais
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="fullName" className="text-sm font-medium">
                            Nome completo *
                          </Label>
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="Seu nome completo"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={`h-12 text-base transition-all duration-200 ${errors.fullName ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}
                          />
                          {errors.fullName && (
                            <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`h-11 transition-all duration-200 ${errors.email ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}
                          />
                          {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium">
                            Telefone *
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(11) 99999-9999"
                            value={phone}
                            onChange={(e) => {
                              const formatted = formatPhone(e.target.value);
                              if (formatted.replace(/\D/g, '').length <= 11) {
                                setPhone(formatted);
                              }
                            }}
                            className={`h-11 transition-all duration-200 ${errors.phone ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}
                          />
                          {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-medium">
                            Senha *
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Mínimo 6 caracteres"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className={`h-11 pr-12 transition-all duration-200 ${errors.password ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          {errors.password && (
                            <p className="text-sm text-destructive">{errors.password}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                          Confirmar Senha *
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Digite a senha novamente"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`h-11 pr-12 transition-all duration-200 ${errors.confirmPassword ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>

                    {/* Informações de Endereço */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <MapPin className="h-4 w-4" />
                        Endereço de Entrega
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zipCode" className="text-sm font-medium">
                            CEP *
                          </Label>
                          <div className="relative">
                            <Input
                              id="zipCode"
                              type="text"
                              placeholder="00000-000"
                              value={zipCode}
                              onChange={(e) => {
                                const formatted = formatCEP(e.target.value);
                                if (formatted.replace(/\D/g, '').length <= 8) {
                                  setZipCode(formatted);
                                  if (formatted.replace(/\D/g, '').length === 8) {
                                    fetchAddressByCEP(formatted);
                                  }
                                }
                              }}
                              className={`h-11 transition-all duration-200 ${errors.zipCode ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}
                            />
                            {isLoadingCep && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                              </div>
                            )}
                          </div>
                          {errors.zipCode && (
                            <p className="text-sm text-destructive">{errors.zipCode}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="street" className="text-sm font-medium">
                            Rua *
                          </Label>
                          <Input
                            id="street"
                            type="text"
                            placeholder="Nome da rua"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className={`h-11 transition-all duration-200 ${errors.street ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}
                          />
                          {errors.street && (
                            <p className="text-sm text-destructive">{errors.street}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="number" className="text-sm font-medium">
                            Número *
                          </Label>
                          <Input
                            id="number"
                            type="text"
                            placeholder="123"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className={`h-11 transition-all duration-200 ${errors.number ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}
                          />
                          {errors.number && (
                            <p className="text-sm text-destructive">{errors.number}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="complement" className="text-sm font-medium">
                            Complemento
                          </Label>
                          <Input
                            id="complement"
                            type="text"
                            placeholder="Apto, casa, etc."
                            value={complement}
                            onChange={(e) => setComplement(e.target.value)}
                            className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-1">
                          <Label htmlFor="state" className="text-sm font-medium">
                            Estado *
                          </Label>
                          <Input
                            id="state"
                            type="text"
                            placeholder="SP"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className={`h-11 transition-all duration-200 ${errors.state ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}
                          />
                          {errors.state && (
                            <p className="text-sm text-destructive">{errors.state}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">
                          Cidade *
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="Sua cidade"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className={`h-11 transition-all duration-200 ${errors.city ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}
                        />
                        {errors.city && (
                          <p className="text-sm text-destructive">{errors.city}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Criando conta...' : 'Criar Conta'}
                      </Button>
                      
                      <p className="text-sm text-muted-foreground text-center">
                        * Campos obrigatórios
                      </p>
                      
                      <p className="text-xs text-muted-foreground text-center leading-relaxed">
                        Ao criar uma conta, você concorda com nossos{' '}
                        <a href="/termos-uso" className="text-primary hover:underline">
                          Termos de Uso
                        </a>{' '}
                        e{' '}
                        <a href="/politica-privacidade" className="text-primary hover:underline">
                          Política de Privacidade
                        </a>
                      </p>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Auth;
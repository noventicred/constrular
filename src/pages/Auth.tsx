import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, FileText, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { AuthRedirect } from '@/components/auth/AuthRedirect';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [isOptionalOpen, setIsOptionalOpen] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!fullName.trim()) newErrors.fullName = 'Nome é obrigatório';
    if (!email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!validateEmail(email)) newErrors.email = 'Email inválido';
    if (!password.trim()) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    
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
            address,
            city,
            state,
            zip_code: zipCode,
            birth_date: birthDate,
            document_number: documentNumber,
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
          description: 'Verifique seu email para confirmar a conta.',
        });
        // Reset form
        setFullName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setAddress('');
        setCity('');
        setState('');
        setZipCode('');
        setBirthDate('');
        setDocumentNumber('');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
        <div className="w-full max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o site
          </Button>

          <Card className="shadow-2xl border-muted/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Bem-vindo
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Acesse sua conta ou crie uma nova para continuar
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="signin" className="text-sm font-medium">
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm font-medium">
                    Criar Conta
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-6 mt-8">
                  <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
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
                          className="h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-sm font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4" />
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
                            className="h-12 pr-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
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
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-6 mt-8">
                  <form onSubmit={handleSignUp} className="space-y-6">
                    {/* Informações Básicas */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <User className="h-4 w-4" />
                        Informações Básicas
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-sm font-medium">
                            Nome completo *
                          </Label>
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="Seu nome completo"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={`h-11 transition-all duration-200 ${errors.fullName ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}
                          />
                          {errors.fullName && (
                            <p className="text-sm text-destructive">{errors.fullName}</p>
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
                            Telefone
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(11) 99999-9999"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
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
                    </div>

                    {/* Informações Opcionais */}
                    <Collapsible open={isOptionalOpen} onOpenChange={setIsOptionalOpen}>
                      <CollapsibleTrigger asChild>
                        <Button 
                          type="button"
                          variant="ghost" 
                          className="w-full justify-between p-4 h-auto border border-muted rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <MapPin className="h-4 w-4" />
                            Informações Adicionais (Opcional)
                          </div>
                          <ChevronDown className={`h-4 w-4 transition-transform ${isOptionalOpen ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="document" className="text-sm font-medium flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              CPF/CNPJ
                            </Label>
                            <Input
                              id="document"
                              type="text"
                              placeholder="000.000.000-00"
                              value={documentNumber}
                              onChange={(e) => setDocumentNumber(e.target.value)}
                              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="birthDate" className="text-sm font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Data de Nascimento
                            </Label>
                            <Input
                              id="birthDate"
                              type="date"
                              value={birthDate}
                              onChange={(e) => setBirthDate(e.target.value)}
                              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Endereço
                            </Label>
                            <Input
                              id="address"
                              type="text"
                              placeholder="Rua, número, complemento"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city" className="text-sm font-medium">
                                Cidade
                              </Label>
                              <Input
                                id="city"
                                type="text"
                                placeholder="Sua cidade"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="state" className="text-sm font-medium">
                                Estado
                              </Label>
                              <Input
                                id="state"
                                type="text"
                                placeholder="SP"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="zipCode" className="text-sm font-medium">
                                CEP
                              </Label>
                              <Input
                                id="zipCode"
                                type="text"
                                placeholder="00000-000"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

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
      </div>
    </>
  );
};

export default Auth;